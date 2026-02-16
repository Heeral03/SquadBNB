// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/MonthlyChallenges.sol";

// Mock SquadManager for testing
contract MockSquadManager {
    mapping(address => bool) public hasSquad;
    mapping(address => string) public userSquadNames;
    mapping(address => uint256) public userPoints;
    
    event PointsAdded(address indexed user, uint256 points);
    
    function setUserInSquad(address user, string memory squadName) external {
        hasSquad[user] = true;
        userSquadNames[user] = squadName;
    }
    
    function getUserProfile(address user) external view returns (
        string memory squadName,
        uint256 totalScore,
        uint256 joinDate,
        uint256 submissionsCount,
        uint256 lastSubmissionTime,
        uint256 verificationCount
    ) {
        if (hasSquad[user]) {
            return (userSquadNames[user], 10, block.timestamp, 5, block.timestamp, 2);
        }
        return ("", 0, 0, 0, 0, 0);
    }
    
    function badgesAddress() external view returns (address) {
        return address(0);
    }
    
    function addPoints(address user, uint256 points) external {
        userPoints[user] += points;
        emit PointsAdded(user, points);
    }
}

contract MonthlyChallengeTest is Test {
    MonthlyChallenge public challenge;
    MockSquadManager public squadManager;
    
    address public owner = address(0x1);
    address public alice = address(0x2);
    address public bob = address(0x3);
    address public charlie = address(0x4);
    address public publisher = address(0x5);
    
    string constant SQUAD_NAME = "BookWorms";
    string constant BOOK_TITLE = "The Alchemist";
    string constant BOOK_AUTHOR = "Paulo Coelho";
    string constant REVIEW_HASH = "QmReview123";

    // Events
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

    function setUp() public {
        squadManager = new MockSquadManager();
        
        // Deploy contract with the squadManager address
        challenge = new MonthlyChallenge(address(squadManager));
        
        // Fund addresses
        vm.deal(owner, 10 ether);
        vm.deal(alice, 1 ether);
        vm.deal(bob, 1 ether);
        vm.deal(charlie, 1 ether);
        vm.deal(publisher, 1 ether);
        
        // Set ALL users in squad
        squadManager.setUserInSquad(alice, SQUAD_NAME);
        squadManager.setUserInSquad(bob, SQUAD_NAME);
        squadManager.setUserInSquad(charlie, SQUAD_NAME);
        squadManager.setUserInSquad(publisher, SQUAD_NAME);
        squadManager.setUserInSquad(owner, SQUAD_NAME);
        
        vm.label(owner, "Owner");
        vm.label(alice, "Alice");
        vm.label(bob, "Bob");
        vm.label(charlie, "Charlie");
        vm.label(publisher, "Publisher");
    }

    // ============ REWARD TESTS ============

    function test_DepositRewards() public {
        uint256 amount = 0.1 ether;
        
        vm.prank(owner);
        challenge.depositRewards{value: amount}();
        
        assertEq(address(challenge).balance, amount);
        assertEq(challenge.rewardPool(), amount);
    }

    function test_WithdrawRewards() public {
        // Setup rewards pool
        vm.prank(owner);
        challenge.depositRewards{value: 0.1 ether}();
        
        // Create and complete a challenge
        (uint256 challengeId) = _createActiveChallenge();
        _executeChallenge();
        _completeChallengeWithParticipants(challengeId);
        
        uint256 pendingRewards = challenge.getPendingRewards(alice);
        assertGt(pendingRewards, 0);
        
        uint256 initialBalance = alice.balance;
        
        vm.prank(alice);
        challenge.withdrawRewards();
        
        assertEq(alice.balance, initialBalance + pendingRewards);
        assertEq(challenge.getPendingRewards(alice), 0);
    }

    // ============ BOOK PROPOSAL TESTS ============

    function test_ProposeBook() public {
        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit BookProposed(0, BOOK_TITLE, BOOK_AUTHOR, alice);
        
        challenge.proposeBook(BOOK_TITLE, BOOK_AUTHOR);
        
        (string memory title, string memory author, address proposer, uint256 votes, bool executed, , ) = 
            challenge.getProposal(0);
        
        assertEq(title, BOOK_TITLE);
        assertEq(author, BOOK_AUTHOR);
        assertEq(proposer, alice);
        assertEq(votes, 0);
        assertFalse(executed);
    }

    function test_ProposeBook_NotInSquad() public {
        address eve = address(0x999);
        
        vm.prank(eve);
        vm.expectRevert("Must be in a squad");
        challenge.proposeBook(BOOK_TITLE, BOOK_AUTHOR);
    }

    function test_SponsorBook() public {
        vm.prank(alice);
        challenge.proposeBook(BOOK_TITLE, BOOK_AUTHOR);
        
        uint256 sponsorAmount = 0.01 ether;
        
        vm.prank(publisher);
        vm.expectEmit(true, true, true, true);
        emit SponsorAdded(0, publisher, sponsorAmount);
        
        challenge.sponsorBook{value: sponsorAmount}(0);
        
        (,,,,, address sponsor, uint256 sponsorAmount_) = challenge.getProposal(0);
        assertEq(sponsor, publisher);
        assertEq(sponsorAmount_, sponsorAmount);
    }

    function test_SponsorBook_MinimumAmount() public {
        vm.prank(alice);
        challenge.proposeBook(BOOK_TITLE, BOOK_AUTHOR);
        
        vm.prank(publisher);
        vm.expectRevert("Minimum 0.001 BNB");
        challenge.sponsorBook{value: 0.0005 ether}(0);
    }

    function test_VoteOnBook() public {
        vm.prank(alice);
        challenge.proposeBook(BOOK_TITLE, BOOK_AUTHOR);
        
        vm.prank(bob);
        vm.expectEmit(true, true, true, true);
        emit BookVoted(0, bob);
        
        challenge.voteOnBook(0);
        
        (,,, uint256 votes,,,) = challenge.getProposal(0);
        assertEq(votes, 1);
    }

    function test_VoteOnBook_AlreadyVoted() public {
        vm.prank(alice);
        challenge.proposeBook(BOOK_TITLE, BOOK_AUTHOR);
        
        vm.prank(bob);
        challenge.voteOnBook(0);
        
        vm.prank(bob);
        vm.expectRevert("Already voted");
        challenge.voteOnBook(0);
    }

    // ============ AUTO-EXECUTE TESTS ============

    function test_AutoExecuteOnSecondVote() public {
        // Setup
        vm.prank(owner);
        challenge.depositRewards{value: 0.1 ether}();
        
        vm.prank(alice);
        challenge.proposeBook(BOOK_TITLE, BOOK_AUTHOR);
        
        vm.prank(publisher);
        challenge.sponsorBook{value: 0.01 ether}(0);
        
        // First vote - should NOT execute
        vm.prank(bob);
        challenge.voteOnBook(0);
        
        // Proposal should not be executed yet
        (,,,, bool executedAfterFirstVote,,) = challenge.getProposal(0);
        assertFalse(executedAfterFirstVote);
        
        // Challenges array should be empty
        assertEq(challenge.getActiveChallenges().length, 0);
        
        // Second vote - should AUTO-EXECUTE
        vm.prank(charlie);
        vm.expectEmit(true, true, true, true);
        emit BookSelected(0, BOOK_TITLE, BOOK_AUTHOR);
        vm.expectEmit(true, true, true, true);
        emit ChallengeCreated(0, BOOK_TITLE, BOOK_AUTHOR, 0.01 ether);
        
        challenge.voteOnBook(0);
        
        // Proposal should be executed now
        (,,,, bool executedAfterSecondVote,,) = challenge.getProposal(0);
        assertTrue(executedAfterSecondVote);
        
        // Challenge should exist
        uint256[] memory activeChallenges = challenge.getActiveChallenges();
        assertEq(activeChallenges.length, 1);
        
        // Verify challenge details
        (uint256 id, string memory title, string memory author, , , uint256 prizePool, address sponsor, bool rewardsDistributed, ) = 
            challenge.getChallenge(0);
        
        assertEq(id, 0);
        assertEq(title, BOOK_TITLE);
        assertEq(author, BOOK_AUTHOR);
        assertEq(prizePool, 0.01 ether);
        assertEq(sponsor, publisher);
        assertFalse(rewardsDistributed);
    }

    function test_ExecuteBookProposal_ManualAfterTwoVotes() public {
        // Setup
        vm.prank(owner);
        challenge.depositRewards{value: 0.1 ether}();
        
        vm.prank(alice);
        challenge.proposeBook(BOOK_TITLE, BOOK_AUTHOR);
        
        vm.prank(publisher);
        challenge.sponsorBook{value: 0.01 ether}(0);
        
        // Add two votes
        vm.prank(bob);
        challenge.voteOnBook(0);
        
        vm.prank(charlie);
        challenge.voteOnBook(0);
        
        // Proposal might have auto-executed, so we need to check
        (,,,, bool executed,,) = challenge.getProposal(0);
        
        if (!executed) {
            // Manual execution should work
            vm.prank(owner);
            challenge.executeBookProposal(0);
            
            (,,,, executed,,) = challenge.getProposal(0);
            assertTrue(executed);
        } else {
            assertTrue(executed);
        }
    }

    function test_CannotExecuteWithoutEnoughVotes() public {
        vm.prank(alice);
        challenge.proposeBook(BOOK_TITLE, BOOK_AUTHOR);
        
        // Only one vote
        vm.prank(bob);
        challenge.voteOnBook(0);
        
        // Manual execution should fail
        vm.prank(owner);
        vm.expectRevert("Not enough votes");
        challenge.executeBookProposal(0);
    }

    // ============ CHALLENGE TESTS ============

    function test_JoinChallenge() public {
        (uint256 challengeId) = _createActiveChallenge();
        _executeChallenge();
        
        uint256 entryFee = challenge.CHALLENGE_ENTRY_FEE();
        uint256 initialPrizePool = _getPrizePool(challengeId);
        
        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit ChallengeJoined(challengeId, alice);
        
        challenge.joinChallenge{value: entryFee}(challengeId);
        
        uint256 newPrizePool = _getPrizePool(challengeId);
        assertEq(newPrizePool, initialPrizePool + entryFee);
        assertEq(_getParticipantCount(challengeId), 1);
    }

function test_JoinChallenge_AlreadyJoined() public {
    // Create a fresh challenge directly in this test
    vm.prank(owner);
    challenge.depositRewards{value: 0.1 ether}();
    
    vm.prank(alice);
    challenge.proposeBook(BOOK_TITLE, BOOK_AUTHOR);
    
    vm.prank(publisher);
    challenge.sponsorBook{value: 0.01 ether}(0);
    
    // First vote
    vm.prank(bob);
    challenge.voteOnBook(0);
    
    // Second vote - auto-executes
    vm.prank(charlie);
    challenge.voteOnBook(0);
    
    // Use startPrank for all of Alice's actions
    vm.startPrank(alice);
    
    // First join
    challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(0);
    
    // Try second join and capture the result
    (bool success, bytes memory data) = address(challenge).call{value: challenge.CHALLENGE_ENTRY_FEE()}(
        abi.encodeWithSignature("joinChallenge(uint256)", 0)
    );
    
    vm.stopPrank();
    
    if (!success) {
        string memory revertReason = _getRevertMsg(data);
        console.log("Second join reverted with:", revertReason);
        assertEq(revertReason, "Already joined", "Should revert with 'Already joined'");
    } else {
        console.log("Second join succeeded when it should have reverted!");
        assertTrue(false, "Second join should have reverted");
    }
}

// Helper function to extract revert message
function _getRevertMsg(bytes memory data) internal pure returns (string memory) {
    if (data.length < 68) return "No revert message";
    assembly {
        data := add(data, 0x04)
    }
    return abi.decode(data, (string));
}
function test_SubmitReview() public {
        (uint256 challengeId) = _createActiveChallenge();
        _executeChallenge();
        
        // Join challenge
        vm.startPrank(alice);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        // Get challenge end time
        (,,,, uint256 endTime, , , , ) = challenge.getChallenge(challengeId);
        
        // Warp to submission window (last 6 hours)
        vm.warp(endTime - challenge.REVIEW_SUBMISSION_WINDOW() + 1);
        
        vm.startPrank(alice);
        vm.expectEmit(true, true, true, true);
        emit ReviewSubmitted(challengeId, 0, alice, REVIEW_HASH);
        
        challenge.submitReview(challengeId, REVIEW_HASH);
        vm.stopPrank();
        
        (address[] memory users, string[] memory hashes, uint256[] memory upvotes) = challenge.getReviews(challengeId);
        assertEq(users.length, 1);
        assertEq(users[0], alice);
        assertEq(hashes[0], REVIEW_HASH);
        assertEq(upvotes[0], 0);
    }

    function test_SubmitReview_TooEarly() public {
        (uint256 challengeId) = _createActiveChallenge();
        _executeChallenge();
        
        vm.startPrank(alice);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        
        // Try to submit too early (before submission window)
        vm.expectRevert("Too early to submit");
        challenge.submitReview(challengeId, REVIEW_HASH);
        vm.stopPrank();
    }

    function test_VoteForReview() public {
        (uint256 challengeId) = _createActiveChallenge();
        _executeChallenge();
        
        // Setup: Alice and Bob join
        vm.startPrank(alice);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        // Get challenge end time
        (,,,, uint256 endTime, , , , ) = challenge.getChallenge(challengeId);
        
        // Warp to submission window
        vm.warp(endTime - challenge.REVIEW_SUBMISSION_WINDOW() + 1);
        
        vm.startPrank(alice);
        challenge.submitReview(challengeId, "QmAliceReview");
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.submitReview(challengeId, "QmBobReview");
        vm.stopPrank();
        
        // Warp to voting period
        vm.warp(endTime + 1);
        
        vm.startPrank(alice);
        vm.expectEmit(true, true, true, true);
        emit Voted(challengeId, 1, alice, bob);
        
        challenge.voteForReview(challengeId, 1);
        vm.stopPrank();
    }

    function test_VoteForReview_AlreadyVoted() public {
        (uint256 challengeId) = _createActiveChallenge();
        _executeChallenge();
        
        // Setup: Alice and Bob join
        vm.startPrank(alice);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        // Get challenge end time
        (,,,, uint256 endTime, , , , ) = challenge.getChallenge(challengeId);
        
        // Warp to submission window
        vm.warp(endTime - challenge.REVIEW_SUBMISSION_WINDOW() + 1);
        
        vm.startPrank(alice);
        challenge.submitReview(challengeId, "QmAliceReview");
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.submitReview(challengeId, "QmBobReview");
        vm.stopPrank();
        
        // Warp to voting period
        vm.warp(endTime + 1);
        
        vm.startPrank(alice);
        challenge.voteForReview(challengeId, 1);
        
        vm.expectRevert("Already voted");
        challenge.voteForReview(challengeId, 1);
        vm.stopPrank();
    }

    function test_CompleteChallenge() public {
        (uint256 challengeId) = _createActiveChallenge();
        _executeChallenge();
        
        // Setup full participation
        vm.startPrank(alice);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        vm.startPrank(charlie);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        // Get challenge end time
        (,,,, uint256 endTime, , , , ) = challenge.getChallenge(challengeId);
        
        // Warp to submission window
        vm.warp(endTime - challenge.REVIEW_SUBMISSION_WINDOW() + 1);
        
        vm.startPrank(alice);
        challenge.submitReview(challengeId, "QmAliceReview");
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.submitReview(challengeId, "QmBobReview");
        vm.stopPrank();
        
        vm.startPrank(charlie);
        challenge.submitReview(challengeId, "QmCharlieReview");
        vm.stopPrank();
        
        // Warp to voting period
        vm.warp(endTime + 1);
        
        // Cast votes
        vm.startPrank(alice);
        challenge.voteForReview(challengeId, 1); // Vote for Bob
        vm.stopPrank();
        
        vm.startPrank(charlie);
        challenge.voteForReview(challengeId, 1); // Vote for Bob
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.voteForReview(challengeId, 0); // Vote for Alice
        vm.stopPrank();
        
        // Warp to after voting period ends
        vm.warp(endTime + challenge.VOTING_DURATION() + 1);
        
        // Complete challenge
        vm.prank(owner);
        challenge.completeChallenge(challengeId);
        
        // Check rewards distributed
        (, , , , , , , bool rewardsDistributed, ) = challenge.getChallenge(challengeId);
        assertTrue(rewardsDistributed);
        
        // Verify rewards were assigned
        assertGt(challenge.getPendingRewards(bob), 0);
        assertGt(challenge.getPendingRewards(alice), 0);
    }

    function test_CompleteChallenge_TooEarly() public {
        (uint256 challengeId) = _createActiveChallenge();
        _executeChallenge();
        
        // Setup: Alice and Bob join
        vm.startPrank(alice);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        // Get challenge end time
        (,,,, uint256 endTime, , , , ) = challenge.getChallenge(challengeId);
        
        // Warp to submission window and submit reviews
        vm.warp(endTime - challenge.REVIEW_SUBMISSION_WINDOW() + 1);
        
        vm.startPrank(alice);
        challenge.submitReview(challengeId, "QmAliceReview");
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.submitReview(challengeId, "QmBobReview");
        vm.stopPrank();
        
        // Warp to after challenge ends but before voting period ends
        vm.warp(endTime + 1);
        
        vm.prank(owner);
        vm.expectRevert("Voting not ended");
        challenge.completeChallenge(challengeId);
    }

    // ============ VIEW FUNCTION TESTS ============

    function test_GetActiveProposals() public {
        vm.prank(alice);
        challenge.proposeBook("Book 1", "Author 1");
        
        vm.prank(bob);
        challenge.proposeBook("Book 2", "Author 2");
        
        uint256[] memory active = challenge.getActiveProposals();
        assertEq(active.length, 2);
        
        // Vote to execute first proposal
        vm.prank(charlie);
        challenge.voteOnBook(0);
        
        vm.prank(owner);
        challenge.voteOnBook(0); // Second vote - auto-executes
        
        // Check active proposals again
        active = challenge.getActiveProposals();
        assertEq(active.length, 1);
        assertEq(active[0], 1);
    }

    function test_GetActiveChallenges() public {
        (uint256 challengeId) = _createActiveChallenge();
        _executeChallenge();
        
        (,,, , uint256 endTime, , , , ) = challenge.getChallenge(challengeId);
        
        uint256[] memory active = challenge.getActiveChallenges();
        assertEq(active.length, 1);
        assertEq(active[0], challengeId);
        
        vm.warp(endTime - 1);
        active = challenge.getActiveChallenges();
        assertEq(active.length, 1, "Challenge should still be active");
        
        vm.warp(endTime + 1);
        active = challenge.getActiveChallenges();
        assertEq(active.length, 0, "Challenge should no longer be active");
    }

    function test_GetParticipants() public {
        (uint256 challengeId) = _createActiveChallenge();
        _executeChallenge();
        
        // Have users join
        vm.startPrank(alice);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        vm.startPrank(charlie);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        address[] memory participants = challenge.getParticipants(challengeId);
        assertEq(participants.length, 3);
        
        bool foundAlice = false;
        bool foundBob = false;
        bool foundCharlie = false;
        
        for (uint i = 0; i < participants.length; i++) {
            if (participants[i] == alice) foundAlice = true;
            if (participants[i] == bob) foundBob = true;
            if (participants[i] == charlie) foundCharlie = true;
        }
        
        assertTrue(foundAlice);
        assertTrue(foundBob);
        assertTrue(foundCharlie);
    }

    function test_GetReviews() public {
        (uint256 challengeId) = _createActiveChallenge();
        _executeChallenge();
        
        // Setup: Users join and submit reviews
        vm.startPrank(alice);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        vm.startPrank(charlie);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        (,,, , uint256 endTime, , , , ) = challenge.getChallenge(challengeId);
        
        vm.warp(endTime - challenge.REVIEW_SUBMISSION_WINDOW() + 1);
        
        vm.startPrank(alice);
        challenge.submitReview(challengeId, "QmAliceReview");
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.submitReview(challengeId, "QmBobReview");
        vm.stopPrank();
        
        vm.startPrank(charlie);
        challenge.submitReview(challengeId, "QmCharlieReview");
        vm.stopPrank();
        
        (address[] memory users, , ) = challenge.getReviews(challengeId);
        assertEq(users.length, 3);
    }

    // ============ FALLBACK TEST ============

    function test_Receive() public {
        uint256 amount = 0.5 ether;
        
        (bool success, ) = address(challenge).call{value: amount}("");
        assertTrue(success);
        
        assertEq(challenge.rewardPool(), amount);
        assertEq(address(challenge).balance, amount);
    }

    // ============ HELPER FUNCTIONS ============

    function _createActiveChallenge() internal returns (uint256) {
        vm.prank(owner);
        challenge.depositRewards{value: 0.1 ether}();
        
        vm.prank(alice);
        challenge.proposeBook(BOOK_TITLE, BOOK_AUTHOR);
        
        // Add sponsor
        vm.prank(publisher);
        challenge.sponsorBook{value: 0.01 ether}(0);
        
        // Add first vote only - DON'T auto-execute yet
        vm.prank(bob);
        challenge.voteOnBook(0);
        
        return 0; // Proposal ID is 0, challenge ID will be 0 after execution
    }

    function _executeChallenge() internal {
        vm.prank(charlie);
        challenge.voteOnBook(0); // Second vote - auto-executes
    }

    function _completeChallengeWithParticipants(uint256 challengeId) internal {
        // Setup full participation
        vm.startPrank(alice);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.joinChallenge{value: challenge.CHALLENGE_ENTRY_FEE()}(challengeId);
        vm.stopPrank();
        
        (,,, , uint256 endTime, , , , ) = challenge.getChallenge(challengeId);
        
        // Warp to submission window
        vm.warp(endTime - challenge.REVIEW_SUBMISSION_WINDOW() + 1);
        
        vm.startPrank(alice);
        challenge.submitReview(challengeId, "QmAliceReview");
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.submitReview(challengeId, "QmBobReview");
        vm.stopPrank();
        
        // Warp to voting period
        vm.warp(endTime + 1);
        
        // Cast votes
        vm.startPrank(alice);
        challenge.voteForReview(challengeId, 1);
        vm.stopPrank();
        
        vm.startPrank(bob);
        challenge.voteForReview(challengeId, 0);
        vm.stopPrank();
        
        // Warp to after voting period
        vm.warp(endTime + challenge.VOTING_DURATION() + 1);
        
        // Complete challenge
        vm.prank(owner);
        challenge.completeChallenge(challengeId);
    }

    function _getPrizePool(uint256 challengeId) internal view returns (uint256) {
        (,,,,, uint256 prizePool, , , ) = challenge.getChallenge(challengeId);
        return prizePool;
    }

    function _getParticipantCount(uint256 challengeId) internal view returns (uint256) {
        (,,,,,,, , uint256 participantCount) = challenge.getChallenge(challengeId);
        return participantCount;
    }
}