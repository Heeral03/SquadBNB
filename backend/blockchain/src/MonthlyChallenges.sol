// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ISquadManager {
    function getUserProfile(address user) external view returns (
        string memory squadName,
        uint256 totalScore,
        uint256 joinDate,
        uint256 submissionsCount,
        uint256 lastSubmissionTime,
        uint256 verificationCount
    );
    
    function badgesAddress() external view returns (address);
    function addPoints(address user, uint256 points) external;
}

contract MonthlyChallenge is Ownable, ReentrancyGuard {
    ISquadManager public squadManager;

    // ============ STRUCTS ============

    struct BookProposal {
        string title;
        string author;
        address proposer;
        uint256 votes;
        bool executed;
        address sponsor;
        uint256 sponsorAmount;
    }

    struct Challenge {
        uint256 id;
        string bookTitle;
        string bookAuthor;
        uint256 startTime;
        uint256 endTime;
        uint256 prizePool;
        address sponsor;
        uint256 sponsorAmount;
        bool rewardsDistributed;
    }

    struct Review {
        address user;
        string ipfsHash;
        uint256 timestamp;
        uint256 upvotes;
        mapping(address => bool) hasVoted;
    }

    // ============ STATE VARIABLES ============

    BookProposal[] public bookProposals;
    mapping(address => mapping(uint256 => bool)) public hasVotedOnProposal;
    
    Challenge[] public challenges;
    mapping(uint256 => mapping(address => bool)) public hasJoinedChallenge;
    mapping(uint256 => address[]) public challengeParticipants;
    
    // challengeId => array of reviews
    mapping(uint256 => Review[]) public challengeReviews;
    mapping(uint256 => mapping(address => uint256)) public userReviewIndex; // challengeId => user => reviewIndex
    
    // Reward tracking
    uint256 public rewardPool;
    mapping(address => uint256) public pendingRewards;

    // ============ CONSTANTS ============
    
    uint256 public constant VOTES_REQUIRED = 2; // Only need 2 votes to pass!
    uint256 public constant CHALLENGE_DURATION = 1 days;
    uint256 public constant REVIEW_SUBMISSION_WINDOW = 6 hours;
    uint256 public constant VOTING_DURATION = 2 hours;
    uint256 public constant MIN_SPONSOR_AMOUNT = 0.001 ether;
    uint256 public constant CHALLENGE_ENTRY_FEE = 0.001 ether;
    uint256 public constant VOTING_REWARD = 0.00005 ether;

    // ============ EVENTS ============

    event BookProposed(uint256 indexed proposalId, string title, string author, address indexed proposer);
    event BookVoted(uint256 indexed proposalId, address indexed voter);
    event BookSelected(uint256 indexed proposalId, string title, string author);
    event SponsorAdded(uint256 indexed proposalId, address indexed sponsor, uint256 amount);
    
    event ChallengeCreated(uint256 indexed challengeId, string bookTitle, string bookAuthor, uint256 prizePool);
    event ChallengeJoined(uint256 indexed challengeId, address indexed user);
    event ReviewSubmitted(uint256 indexed challengeId, uint256 reviewId, address indexed user, string ipfsHash);
    event Voted(uint256 indexed challengeId, uint256 reviewId, address indexed voter, address indexed author);
    event ChallengeCompleted(uint256 indexed challengeId, address[] winners, uint256 totalPrize);
    
    event RewardAdded(address indexed user, uint256 amount, string reason);
    event RewardWithdrawn(address indexed user, uint256 amount);

    // ============ CONSTRUCTOR ============

    constructor(address _squadManager) Ownable(msg.sender) {
        require(_squadManager != address(0), "Invalid SquadManager address");
        squadManager = ISquadManager(_squadManager);
    }

    // ============ MODIFIERS ============

    modifier onlySquadMember() {
        (string memory squadName,,,,,) = squadManager.getUserProfile(msg.sender);
        require(bytes(squadName).length > 0, "Must be in a squad");
        _;
    }

    // ============ REWARD FUNCTIONS ============

    function depositRewards() external payable {
        rewardPool += msg.value;
    }

    function withdrawRewards() external nonReentrant {
        uint256 amount = pendingRewards[msg.sender];
        require(amount > 0, "No rewards");
        require(amount <= rewardPool, "Insufficient pool");
        
        pendingRewards[msg.sender] = 0;
        rewardPool -= amount;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit RewardWithdrawn(msg.sender, amount);
    }

    function getPendingRewards(address user) external view returns (uint256) {
        return pendingRewards[user];
    }

    // ============ BOOK PROPOSAL FUNCTIONS ============

    function proposeBook(string calldata title, string calldata author) external onlySquadMember {
        require(bytes(title).length > 0, "Title required");
        require(bytes(author).length > 0, "Author required");

        bookProposals.push(BookProposal({
            title: title,
            author: author,
            proposer: msg.sender,
            votes: 0,
            executed: false,
            sponsor: address(0),
            sponsorAmount: 0
        }));

        emit BookProposed(bookProposals.length - 1, title, author, msg.sender);
    }

    function sponsorBook(uint256 proposalId) external payable {
        require(proposalId < bookProposals.length, "Invalid proposal");
        BookProposal storage proposal = bookProposals[proposalId];
        require(!proposal.executed, "Already executed");
        require(msg.value >= MIN_SPONSOR_AMOUNT, "Minimum 0.001 BNB");

        if (proposal.sponsor == address(0)) {
            proposal.sponsor = msg.sender;
        }
        proposal.sponsorAmount += msg.value;

        emit SponsorAdded(proposalId, msg.sender, msg.value);
    }

    function voteOnBook(uint256 proposalId) external onlySquadMember {
        require(proposalId < bookProposals.length, "Invalid proposal");
        BookProposal storage proposal = bookProposals[proposalId];
        require(!proposal.executed, "Already executed");
        require(!hasVotedOnProposal[msg.sender][proposalId], "Already voted");

        proposal.votes++;
        hasVotedOnProposal[msg.sender][proposalId] = true;

        emit BookVoted(proposalId, msg.sender);

        // 🔥 AUTO-EXECUTE WHEN VOTES REACH 2!
        if (proposal.votes >= VOTES_REQUIRED && !proposal.executed) {
            _executeProposal(proposalId);
        }
    }

    // Internal function to execute proposal
    function _executeProposal(uint256 proposalId) internal {
        BookProposal storage proposal = bookProposals[proposalId];
        require(!proposal.executed, "Already executed");
        
        uint256 challengeId = challenges.length;

        challenges.push(Challenge({
            id: challengeId,
            bookTitle: proposal.title,
            bookAuthor: proposal.author,
            startTime: block.timestamp,
            endTime: block.timestamp + CHALLENGE_DURATION,
            prizePool: proposal.sponsorAmount,
            sponsor: proposal.sponsor,
            sponsorAmount: proposal.sponsorAmount,
            rewardsDistributed: false
        }));

        proposal.executed = true;

        // Reward proposer (10% of sponsor amount) from reward pool
        if (proposal.sponsorAmount > 0) {
            uint256 proposerReward = proposal.sponsorAmount / 10;
            if (proposerReward <= rewardPool) {
                pendingRewards[proposal.proposer] += proposerReward;
                rewardPool -= proposerReward;
                emit RewardAdded(proposal.proposer, proposerReward, "Book proposal reward");
            }
        }

        emit BookSelected(proposalId, proposal.title, proposal.author);
        emit ChallengeCreated(challengeId, proposal.title, proposal.author, proposal.sponsorAmount);
    }

    // Public function to manually execute if needed (but auto-execute on vote should handle it)
    function executeBookProposal(uint256 proposalId) external {
        require(proposalId < bookProposals.length, "Invalid proposal");
        BookProposal storage proposal = bookProposals[proposalId];
        require(proposal.votes >= VOTES_REQUIRED, "Not enough votes");
        require(!proposal.executed, "Already executed");
        
        _executeProposal(proposalId);
    }

    // ============ CHALLENGE FUNCTIONS ============

    function joinChallenge(uint256 challengeId) external payable onlySquadMember {
        require(challengeId < challenges.length, "Invalid challenge");
        Challenge storage challenge = challenges[challengeId];
        require(block.timestamp < challenge.endTime, "Challenge ended");
        require(!hasJoinedChallenge[challengeId][msg.sender], "Already joined");
        require(msg.value == CHALLENGE_ENTRY_FEE, "Entry fee is 0.001 BNB");

        hasJoinedChallenge[challengeId][msg.sender] = true;
        challengeParticipants[challengeId].push(msg.sender);
        
        // Add entry fee to prize pool
        challenge.prizePool += msg.value;

        emit ChallengeJoined(challengeId, msg.sender);
    }

    function submitReview(uint256 challengeId, string calldata ipfsHash) external {
        require(challengeId < challenges.length, "Invalid challenge");
        Challenge storage challenge = challenges[challengeId];
        
        // Submission window: last 6 hours of the challenge
        require(block.timestamp >= challenge.endTime - REVIEW_SUBMISSION_WINDOW, "Too early to submit");
        require(block.timestamp <= challenge.endTime, "Submission period ended");
        require(hasJoinedChallenge[challengeId][msg.sender], "Not a participant");
        require(userReviewIndex[challengeId][msg.sender] == 0, "Already submitted");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");

        uint256 reviewId = challengeReviews[challengeId].length;
        
        Review storage newReview = challengeReviews[challengeId].push();
        newReview.user = msg.sender;
        newReview.ipfsHash = ipfsHash;
        newReview.timestamp = block.timestamp;
        newReview.upvotes = 0;

        userReviewIndex[challengeId][msg.sender] = reviewId + 1; // 1-indexed to distinguish from 0

        emit ReviewSubmitted(challengeId, reviewId, msg.sender, ipfsHash);
    }

    function voteForReview(uint256 challengeId, uint256 reviewId) external {
        require(challengeId < challenges.length, "Invalid challenge");
        Challenge storage challenge = challenges[challengeId];
        
        // Voting period: after challenge ends
        require(block.timestamp > challenge.endTime, "Challenge not ended");
        require(block.timestamp <= challenge.endTime + VOTING_DURATION, "Voting ended");
        require(hasJoinedChallenge[challengeId][msg.sender], "Not a participant");
        require(reviewId < challengeReviews[challengeId].length, "Invalid review");
        
        Review storage review = challengeReviews[challengeId][reviewId];
        require(review.user != msg.sender, "Cannot vote for yourself");
        require(!review.hasVoted[msg.sender], "Already voted");

        review.upvotes++;
        review.hasVoted[msg.sender] = true;

        // Small reward for voting
        if (rewardPool >= VOTING_REWARD) {
            pendingRewards[msg.sender] += VOTING_REWARD;
            rewardPool -= VOTING_REWARD;
            emit RewardAdded(msg.sender, VOTING_REWARD, "Voting reward");
        }

        emit Voted(challengeId, reviewId, msg.sender, review.user);
    }

    function completeChallenge(uint256 challengeId) external nonReentrant {
        require(challengeId < challenges.length, "Invalid challenge");
        Challenge storage challenge = challenges[challengeId];
        require(block.timestamp > challenge.endTime + VOTING_DURATION, "Voting not ended");
        require(!challenge.rewardsDistributed, "Already distributed");
        require(challengeParticipants[challengeId].length > 0, "No participants");

        // Get top 3 reviews by upvotes
        address[] memory top3 = _getTopVoted(challengeId);
        
        uint256 totalPrize = challenge.prizePool;

        // Distribute prizes: 50%, 30%, 20%
        if (top3.length > 0) {
            uint256 winnerShare = totalPrize * 50 / 100;
            pendingRewards[top3[0]] += winnerShare;
            emit RewardAdded(top3[0], winnerShare, "Challenge winner");
        }

        if (top3.length > 1) {
            uint256 runnerUpShare = totalPrize * 30 / 100;
            pendingRewards[top3[1]] += runnerUpShare;
            emit RewardAdded(top3[1], runnerUpShare, "Challenge runner-up");
        }

        if (top3.length > 2) {
            uint256 thirdShare = totalPrize * 20 / 100;
            pendingRewards[top3[2]] += thirdShare;
            emit RewardAdded(top3[2], thirdShare, "Challenge third place");
        }

        challenge.rewardsDistributed = true;

        emit ChallengeCompleted(challengeId, top3, totalPrize);
    }

    // ============ INTERNAL FUNCTIONS ============
    function _getTopVoted(uint256 challengeId) internal view returns (address[] memory) {
        uint256 n = challengeReviews[challengeId].length;
        
        if (n == 0) return new address[](0);

        // Create separate arrays for addresses and upvotes
        address[] memory participants = new address[](n);
        uint256[] memory upvotes = new uint256[](n);

        for (uint i = 0; i < n; i++) {
            Review storage review = challengeReviews[challengeId][i];
            participants[i] = review.user;
            upvotes[i] = review.upvotes;
        }

        // Bubble sort by upvotes (descending)
        for (uint i = 0; i < n - 1; i++) {
            for (uint j = 0; j < n - i - 1; j++) {
                if (upvotes[j] < upvotes[j + 1]) {
                    // Swap upvotes
                    (upvotes[j], upvotes[j + 1]) = (upvotes[j + 1], upvotes[j]);
                    // Swap addresses
                    (participants[j], participants[j + 1]) = (participants[j + 1], participants[j]);
                }
            }
        }

        // Return top 3
        uint256 resultLength = n > 3 ? 3 : n;
        address[] memory result = new address[](resultLength);
        for (uint i = 0; i < resultLength; i++) {
            result[i] = participants[i];
        }

        return result;
    }

    // ============ VIEW FUNCTIONS ============

    function getProposal(uint256 proposalId) external view returns (
        string memory title,
        string memory author,
        address proposer,
        uint256 votes,
        bool executed,
        address sponsor,
        uint256 sponsorAmount
    ) {
        BookProposal storage p = bookProposals[proposalId];
        return (
            p.title,
            p.author,
            p.proposer,
            p.votes,
            p.executed,
            p.sponsor,
            p.sponsorAmount
        );
    }

    function getActiveProposals() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < bookProposals.length; i++) {
            if (!bookProposals[i].executed) {
                count++;
            }
        }

        uint256[] memory active = new uint256[](count);
        uint256 index = 0;
        for (uint i = 0; i < bookProposals.length; i++) {
            if (!bookProposals[i].executed) {
                active[index] = i;
                index++;
            }
        }
        return active;
    }

    function getChallenge(uint256 challengeId) external view returns (
        uint256 id,
        string memory bookTitle,
        string memory bookAuthor,
        uint256 startTime,
        uint256 endTime,
        uint256 prizePool,
        address sponsor,
        bool rewardsDistributed,
        uint256 participantCount
    ) {
        Challenge storage c = challenges[challengeId];
        return (
            c.id,
            c.bookTitle,
            c.bookAuthor,
            c.startTime,
            c.endTime,
            c.prizePool,
            c.sponsor,
            c.rewardsDistributed,
            challengeParticipants[challengeId].length
        );
    }

    function getActiveChallenges() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < challenges.length; i++) {
            if (!challenges[i].rewardsDistributed && block.timestamp < challenges[i].endTime) {
                count++;
            }
        }

        uint256[] memory active = new uint256[](count);
        uint256 index = 0;
        for (uint i = 0; i < challenges.length; i++) {
            if (!challenges[i].rewardsDistributed && block.timestamp < challenges[i].endTime) {
                active[index] = i;
                index++;
            }
        }
        return active;
    }

    function getReviews(uint256 challengeId) external view returns (
        address[] memory users,
        string[] memory ipfsHashes,
        uint256[] memory upvotes
    ) {
        uint256 n = challengeReviews[challengeId].length;
        
        users = new address[](n);
        ipfsHashes = new string[](n);
        upvotes = new uint256[](n);

        for (uint i = 0; i < n; i++) {
            Review storage review = challengeReviews[challengeId][i];
            users[i] = review.user;
            ipfsHashes[i] = review.ipfsHash;
            upvotes[i] = review.upvotes;
        }

        return (users, ipfsHashes, upvotes);
    }

    function getParticipants(uint256 challengeId) external view returns (address[] memory) {
        return challengeParticipants[challengeId];
    }

    // ============ FALLBACK ============

    receive() external payable {
        rewardPool += msg.value;
    }
}