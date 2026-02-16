// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface IBadgeNFT {
    enum BadgeType {
        FIRST_SUBMISSION,
        TEN_SUBMISSIONS,
        FIFTY_SUBMISSIONS,
        HUNDRED_SUBMISSIONS,
        VERIFIER_HERO,
        SQUAD_CHAMPION
    }
    
    function mintBadge(address user, IBadgeNFT.BadgeType badgeType) external returns (uint256);
    function hasBadge(address user, IBadgeNFT.BadgeType badgeType) external view returns (bool);
}

contract SquadManager is Ownable {
    using Strings for uint256;

    // Structs
    struct Squad {
        string name;
        address[] members;
        uint256 score;
        uint256 createdAt;
        address creator;
        bool exists;
    }

    // UPDATED: Submission struct with photo (ipfsHash) + quote + challengeDay
    struct Submission {
        address user;
        string ipfsHash;      // Photo stored on IPFS
        string quote;          // Quote stored on-chain
        string challengeDay;   // YYYY-MM-DD
        bool verified;         // Becomes true when enough verifications
        uint256 timestamp;
        uint256 squadScore;    // Score at time of submission
        address[] verifiers;   // Track who verified
        uint256 verifyCount;   // Number of verifications received
    }

    struct UserProfile {
        string squadName;
        uint256 totalScore;
        uint256 joinDate;
        uint256 submissionsCount;
        uint256 lastSubmissionTime;
        uint256 verificationCount;  // How many times this user has verified others
    }

    // State variables
    mapping(string => Squad) public squads;
    mapping(address => UserProfile) public users;
    mapping(string => Submission[]) public squadSubmissions; // squadName => submissions
    mapping(address => uint256) public userSubmissionCount;
    
    string[] public squadNames;
    uint256 private squadCount;

    // Badges contract
    address public badgesAddress;

    // Constants
    uint256 public constant MAX_SQUAD_SIZE = 20;
    uint256 public constant SUBMISSION_COOLDOWN = 1 days;
    uint256 public constant MIN_SQUAD_NAME_LENGTH = 3;
    uint256 public constant MAX_SQUAD_NAME_LENGTH = 32;
    
    // NEW: Verification threshold
    uint256 public constant VERIFICATION_THRESHOLD = 3; // Need 3 verifications

    // Events
    event SquadCreated(string indexed squadName, address indexed creator, uint256 timestamp);
    event SquadJoined(string indexed squadName, address indexed user, uint256 timestamp);
    event SubmissionAdded(string indexed squadName, address indexed user, string ipfsHash, string quote, string challengeDay);
    event SubmissionVerified(string indexed squadName, address indexed user, uint256 index, address indexed verifier, uint256 verifyCount);
    event SubmissionConfirmed(string indexed squadName, address indexed user, uint256 index, uint256 timestamp);
    event ScoreUpdated(string indexed squadName, uint256 newScore, address indexed contributor);
    event UserLeftSquad(string indexed squadName, address indexed user, uint256 timestamp);
    event BadgeMinted(address indexed user, uint8 badgeType, uint256 tokenId);
    event BadgesAddressUpdated(address indexed newAddress);

    // Modifiers
    modifier validSquadName(string calldata name) {
        bytes memory nameBytes = bytes(name);
        require(nameBytes.length >= MIN_SQUAD_NAME_LENGTH && 
                nameBytes.length <= MAX_SQUAD_NAME_LENGTH, 
                "Invalid squad name length");
        _;
    }

    modifier squadExists(string calldata name) {
        require(squads[name].exists, "Squad does not exist");
        _;
    }

    modifier notInSquad(address user) {
        require(bytes(users[user].squadName).length == 0, "Already in a squad");
        _;
    }

    modifier onlySquadMember(string calldata squadName) {
        require(_isMember(squadName, msg.sender), "Not a squad member");
        _;
    }

    modifier onlySquadCreator(string calldata squadName) {
        require(squads[squadName].creator == msg.sender, "Only squad creator");
        _;
    }

    // Constructor
    constructor() Ownable(msg.sender) {
        squadCount = 0;
    }

    // --- Admin Functions ---

    function setBadgesAddress(address _badgesAddress) external onlyOwner {
        require(_badgesAddress != address(0), "Invalid address");
        badgesAddress = _badgesAddress;
        emit BadgesAddressUpdated(_badgesAddress);
    }

    // --- Core Functions ---

    function createSquad(string calldata name) 
        external 
        validSquadName(name) 
        notInSquad(msg.sender) 
    {
        require(!squads[name].exists, "Squad already exists");

        address[] memory members;
        
        squads[name] = Squad({
            name: name,
            members: members,
            score: 0,
            createdAt: block.timestamp,
            creator: msg.sender,
            exists: true
        });
        
        squads[name].members.push(msg.sender);
        
        users[msg.sender] = UserProfile({
            squadName: name,
            totalScore: 0,
            joinDate: block.timestamp,
            submissionsCount: 0,
            lastSubmissionTime: 0,
            verificationCount: 0
        });
        
        squadNames.push(name);
        squadCount++;

        emit SquadCreated(name, msg.sender, block.timestamp);
    }

    function joinSquad(string calldata name) 
        external 
        squadExists(name) 
        notInSquad(msg.sender) 
    {
        require(squads[name].members.length < MAX_SQUAD_SIZE, "Squad is full");
        require(!_isMember(name, msg.sender), "Already a member");

        squads[name].members.push(msg.sender);
        
        users[msg.sender] = UserProfile({
            squadName: name,
            totalScore: 0,
            joinDate: block.timestamp,
            submissionsCount: 0,
            lastSubmissionTime: 0,
            verificationCount: 0
        });

        emit SquadJoined(name, msg.sender, block.timestamp);
    }

    function leaveSquad() external {
        string memory squadName = users[msg.sender].squadName;
        require(bytes(squadName).length > 0, "Not in a squad");

        Squad storage squad = squads[squadName];
        
        for (uint i = 0; i < squad.members.length; i++) {
            if (squad.members[i] == msg.sender) {
                squad.members[i] = squad.members[squad.members.length - 1];
                squad.members.pop();
                break;
            }
        }
        
        delete users[msg.sender];

        emit UserLeftSquad(squadName, msg.sender, block.timestamp);
    }

    // 🔥 FIXED: submit function now accepts photo (ipfsHash), quote, and challengeDay
    function submit(string calldata ipfsHash, string calldata quote, string calldata challengeDay) external {
        string memory squadName = users[msg.sender].squadName;
        require(bytes(squadName).length > 0, "Not in a squad");
        
        require(
            block.timestamp > users[msg.sender].lastSubmissionTime + SUBMISSION_COOLDOWN,
            "Please wait 24h between submissions"
        );

        // Create empty verifiers array
        address[] memory verifiers;
        
        squadSubmissions[squadName].push(Submission({
            user: msg.sender,
            ipfsHash: ipfsHash,      // Photo stored on IPFS
            quote: quote,             // Quote stored on-chain
            challengeDay: challengeDay,
            verified: false,
            timestamp: block.timestamp,
            squadScore: squads[squadName].score,
            verifiers: verifiers,
            verifyCount: 0
        }));

        users[msg.sender].submissionsCount++;
        users[msg.sender].lastSubmissionTime = block.timestamp;
        userSubmissionCount[msg.sender]++;

        emit SubmissionAdded(squadName, msg.sender, ipfsHash, quote, challengeDay);
    }

    // UPDATED: Verify submission with threshold
    function verifySubmission(string calldata squadName, uint256 index) 
        external 
        squadExists(squadName) 
        onlySquadMember(squadName) 
    {
        require(index < squadSubmissions[squadName].length, "Invalid index");
        
        Submission storage sub = squadSubmissions[squadName][index];
        require(!sub.verified, "Already fully verified");
        require(sub.user != msg.sender, "Cannot verify yourself");
        
        // Check if this user already verified
        for (uint i = 0; i < sub.verifiers.length; i++) {
            require(sub.verifiers[i] != msg.sender, "Already verified by you");
        }

        // Add verification
        sub.verifiers.push(msg.sender);
        sub.verifyCount++;
        
        // Update verifier's count
        users[msg.sender].verificationCount++;

        emit SubmissionVerified(squadName, sub.user, index, msg.sender, sub.verifyCount);

        // Check if reached threshold
        if (sub.verifyCount >= VERIFICATION_THRESHOLD && !sub.verified) {
            _confirmSubmission(squadName, index, sub.user);
        }
    }

    // Internal function to confirm submission when threshold reached
    function _confirmSubmission(string memory squadName, uint256 index, address submitter) internal {
        Submission storage sub = squadSubmissions[squadName][index];
        sub.verified = true;
        
        // Award points to squad and submitter
        squads[squadName].score += 1;
        users[submitter].totalScore += 1;

        emit SubmissionConfirmed(squadName, submitter, index, block.timestamp);
        emit ScoreUpdated(squadName, squads[squadName].score, submitter);

        // Award badges
        _checkAndMintBadges(submitter);
        
        // Also check badges for all verifiers
        for (uint i = 0; i < sub.verifiers.length; i++) {
            _checkAndMintBadges(sub.verifiers[i]);
        }
    }

    // --- Badge Functions ---

    function _checkAndMintBadges(address user) internal {
        if (badgesAddress == address(0)) return;
        
        IBadgeNFT badges = IBadgeNFT(badgesAddress);
        UserProfile storage profile = users[user];
        
        // Submission badges
        if (profile.totalScore == 1 && !badges.hasBadge(user, IBadgeNFT.BadgeType.FIRST_SUBMISSION)) {
            uint256 tokenId = badges.mintBadge(user, IBadgeNFT.BadgeType.FIRST_SUBMISSION);
            emit BadgeMinted(user, uint8(IBadgeNFT.BadgeType.FIRST_SUBMISSION), tokenId);
        }
        
        if (profile.totalScore == 10 && !badges.hasBadge(user, IBadgeNFT.BadgeType.TEN_SUBMISSIONS)) {
            uint256 tokenId = badges.mintBadge(user, IBadgeNFT.BadgeType.TEN_SUBMISSIONS);
            emit BadgeMinted(user, uint8(IBadgeNFT.BadgeType.TEN_SUBMISSIONS), tokenId);
        }
        
        if (profile.totalScore == 50 && !badges.hasBadge(user, IBadgeNFT.BadgeType.FIFTY_SUBMISSIONS)) {
            uint256 tokenId = badges.mintBadge(user, IBadgeNFT.BadgeType.FIFTY_SUBMISSIONS);
            emit BadgeMinted(user, uint8(IBadgeNFT.BadgeType.FIFTY_SUBMISSIONS), tokenId);
        }
        
        if (profile.totalScore == 100 && !badges.hasBadge(user, IBadgeNFT.BadgeType.HUNDRED_SUBMISSIONS)) {
            uint256 tokenId = badges.mintBadge(user, IBadgeNFT.BadgeType.HUNDRED_SUBMISSIONS);
            emit BadgeMinted(user, uint8(IBadgeNFT.BadgeType.HUNDRED_SUBMISSIONS), tokenId);
        }
        
        // Verifier badge
        if (profile.verificationCount == 5 && !badges.hasBadge(user, IBadgeNFT.BadgeType.VERIFIER_HERO)) {
            uint256 tokenId = badges.mintBadge(user, IBadgeNFT.BadgeType.VERIFIER_HERO);
            emit BadgeMinted(user, uint8(IBadgeNFT.BadgeType.VERIFIER_HERO), tokenId);
        }
        
        // Squad champion badge
        if (profile.totalScore == 20 && !badges.hasBadge(user, IBadgeNFT.BadgeType.SQUAD_CHAMPION)) {
            uint256 tokenId = badges.mintBadge(user, IBadgeNFT.BadgeType.SQUAD_CHAMPION);
            emit BadgeMinted(user, uint8(IBadgeNFT.BadgeType.SQUAD_CHAMPION), tokenId);
        }
    }

    // --- View Functions ---

    function _isMember(string memory squadName, address user) internal view returns (bool) {
        for (uint i = 0; i < squads[squadName].members.length; i++) {
            if (squads[squadName].members[i] == user) return true;
        }
        return false;
    }

    function isMember(string calldata squadName, address user) external view returns (bool) {
        return _isMember(squadName, user);
    }

    function getSquad(string calldata name) 
        external 
        view 
        returns (
            string memory squadName,
            address[] memory members,
            uint256 score,
            uint256 createdAt,
            address creator,
            uint256 memberCount
        ) 
    {
        Squad storage s = squads[name];
        return (
            s.name, 
            s.members, 
            s.score, 
            s.createdAt, 
            s.creator,
            s.members.length
        );
    }

    function getAllSquads() external view returns (string[] memory) {
        return squadNames;
    }

    function getSquadCount() external view returns (uint256) {
        return squadCount;
    }

    // Get submissions with photo (ipfsHash) and quote
    function getSubmissions(string calldata name) 
        external 
        view 
        returns (Submission[] memory) 
    {
        return squadSubmissions[name];
    }

    // Get verification status for a submission
    function getSubmissionVerificationStatus(string calldata squadName, uint256 index)
        external
        view
        returns (uint256 verifyCount, bool isVerified, address[] memory verifiers)
    {
        require(index < squadSubmissions[squadName].length, "Invalid index");
        Submission storage sub = squadSubmissions[squadName][index];
        return (sub.verifyCount, sub.verified, sub.verifiers);
    }

    function getUserProfile(address user) 
        external 
        view 
        returns (
            string memory squadName,
            uint256 totalScore,
            uint256 joinDate,
            uint256 submissionsCount,
            uint256 lastSubmissionTime,
            uint256 verificationCount
        ) 
    {
        UserProfile memory profile = users[user];
        return (
            profile.squadName, 
            profile.totalScore, 
            profile.joinDate, 
            profile.submissionsCount,
            profile.lastSubmissionTime,
            profile.verificationCount
        );
    }

    function getSubmissionsForUser(address user) 
        external 
        view 
        returns (Submission[] memory) 
    {
        string memory squadName = users[user].squadName;
        if (bytes(squadName).length == 0) {
            return new Submission[](0);
        }

        uint256 count = 0;
        for (uint i = 0; i < squadSubmissions[squadName].length; i++) {
            if (squadSubmissions[squadName][i].user == user) {
                count++;
            }
        }

        Submission[] memory userSubs = new Submission[](count);
        uint256 index = 0;
        for (uint i = 0; i < squadSubmissions[squadName].length; i++) {
            if (squadSubmissions[squadName][i].user == user) {
                userSubs[index] = squadSubmissions[squadName][i];
                index++;
            }
        }
        
        return userSubs;
    }

    // Leaderboard
    function getLeaderboard() 
        external 
        view 
        returns (
            string[] memory names,
            uint256[] memory scores,
            uint256[] memory memberCounts,
            uint256[] memory createdAt
        ) 
    {
        uint256 count = squadNames.length;
        names = new string[](count);
        scores = new uint256[](count);
        memberCounts = new uint256[](count);
        createdAt = new uint256[](count);
        
        for (uint i = 0; i < count; i++) {
            string memory squadName = squadNames[i];
            names[i] = squadName;
            scores[i] = squads[squadName].score;
            memberCounts[i] = squads[squadName].members.length;
            createdAt[i] = squads[squadName].createdAt;
        }
        
        // Bubble sort by score (descending)
        for (uint i = 0; i < count - 1; i++) {
            for (uint j = 0; j < count - i - 1; j++) {
                if (scores[j] < scores[j + 1]) {
                    (scores[j], scores[j + 1]) = (scores[j + 1], scores[j]);
                    (names[j], names[j + 1]) = (names[j + 1], names[j]);
                    (memberCounts[j], memberCounts[j + 1]) = (memberCounts[j + 1], memberCounts[j]);
                    (createdAt[j], createdAt[j + 1]) = (createdAt[j + 1], createdAt[j]);
                }
            }
        }
    }

    function canSubmitToday(address user) external view returns (bool) {
        return block.timestamp > users[user].lastSubmissionTime + SUBMISSION_COOLDOWN;
    }
}