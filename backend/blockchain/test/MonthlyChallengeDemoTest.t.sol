// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/MonthlyChallengesDemo.sol";

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

contract MonthlyChallengeDemoTest is Test {
    MonthlyChallengeDemo public challenge;
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

    // Demo timings (in seconds)
    uint256 constant CHALLENGE_DURATION = 60;
    uint256 constant REVIEW_WINDOW = 15;
    uint256 constant VOTING_DURATION = 20;

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
        challenge = new MonthlyChallengeDemo(address(squadManager));
        
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
        
        // Fund reward pool
        vm.prank(owner);
        challenge.depositRewards{value: 0.1 ether}();
        
        vm.label(owner, "Owner");
        vm.label(alice, "Alice");
        vm.label(bob, "Bob");
        vm.label(charlie, "Charlie");
        vm.label(publisher, "Publisher");
    }

    // ============ DEMO TIMING TESTS ============

    function test_DemoTimings() public view {
        assertEq(challenge.CHALLENGE_DURATION(), CHALLENGE_DURATION, "Challenge duration should be 60 seconds");
        assertEq(challenge.REVIEW_SUBMISSION_WINDOW(), REVIEW_WINDOW, "Review window should be 15 seconds");
        assertEq(challenge.VOTING_DURATION(), VOTING_DURATION, "Voting duration should be 20 seconds");
    }

    // ============ COMPLETE 90-SECOND DEMO FLOW ============

 function test_CompleteDemoFlow() public {
    console.log("\nStarting 90-Second Demo Flow");
    console.log("=================================");
    
    // Step 1: Propose book (0s)
    console.log("\n1. Proposing book...");
    vm.prank(alice);
    challenge.proposeBook(BOOK_TITLE, BOOK_AUTHOR);
    console.log("   - Book proposed by Alice");
    
    // Step 2: Add sponsor (5s)
    console.log("\n2. Adding sponsor...");
    vm.prank(publisher);
    challenge.sponsorBook{value: 0.01 ether}(0);
    console.log("   - Publisher sponsored with 0.01 BNB");
    
    // Step 3: First vote (10s)
    console.log("\n3. First vote...");
    vm.prank(bob);
    challenge.voteOnBook(0);
    console.log("   - Bob voted");
    
    // Step 4: Second vote - auto-executes (15s)
    console.log("\n4. Second vote (auto-executes)...");
    vm.prank(charlie);
    challenge.voteOnBook(0);
    console.log("   - Charlie voted - Challenge created!");
    
    // Verify challenge created
    (uint256 id, string memory title, , , , uint256 prizePool, , , ) = challenge.getChallenge(0);
    assertEq(id, 0);
    assertEq(title, BOOK_TITLE);
    assertEq(prizePool, 0.01 ether);
    console.log("   - Prize Pool:", prizePool, "wei");
    
    // Step 5: Join challenge (20s)
    console.log("\n5. Joining challenge...");
    vm.prank(alice);
    challenge.joinChallenge{value: 0.001 ether}(0);
    console.log("   - Alice joined");
    
    vm.prank(bob);
    challenge.joinChallenge{value: 0.001 ether}(0);
    console.log("   - Bob joined");
    
    // Check participants
    address[] memory participants = challenge.getParticipants(0);
    assertEq(participants.length, 2);
    console.log("   - Participants:", participants.length);
    
    // Get challenge end time
    (,,,, uint256 endTime, , , , ) = challenge.getChallenge(0);
    
    // Step 6: Warp to submission window
    console.log("\n6. Warping to submission window...");
    vm.warp(endTime - 15 + 1);
    console.log("   - Time:", block.timestamp);
    console.log("   - Submission window open!");
    
    // Step 7: Submit reviews
    console.log("\n7. Submitting reviews...");
    
    vm.prank(alice);
    challenge.submitReview(0, "QmAliceReview");
    console.log("   - Alice submitted review");
    
    vm.prank(bob);
    challenge.submitReview(0, "QmBobReview");
    console.log("   - Bob submitted review");
    
    // Verify reviews
    (address[] memory users, , ) = challenge.getReviews(0);
    assertEq(users.length, 2);
    console.log("   - Total reviews:", users.length);
    
    // Step 8: Warp to voting period
    console.log("\n8. Warping to voting period...");
    vm.warp(endTime + 1);
    console.log("   - Time:", block.timestamp);
    console.log("   - Voting started!");
    
    // Step 9: Vote on reviews
    console.log("\n9. Casting votes...");
    
    vm.prank(alice);
    challenge.voteForReview(0, 1);
    console.log("   - Alice voted for Bob");
    
    vm.prank(bob);
    challenge.voteForReview(0, 0);
    console.log("   - Bob voted for Alice");
    
    // Step 10: Warp to after voting
    console.log("\n10. Warping to completion...");
    vm.warp(endTime + 20 + 1);
    console.log("   - Time:", block.timestamp);
    console.log("   - Challenge ready to complete!");
    
    // Step 11: Complete challenge
    console.log("\n11. Completing challenge...");
    vm.prank(owner);
    
    // Call without expectEmit
    challenge.completeChallenge(0);
    console.log("   - Challenge completed!");
    
    // Verify challenge completed
    (,,,,,,, bool rewardsDistributed,) = challenge.getChallenge(0);
    assertTrue(rewardsDistributed, "Rewards should be distributed");
    console.log("   - Rewards distributed!");
    
    // Check rewards
    uint256 aliceRewards = challenge.getPendingRewards(alice);
    uint256 bobRewards = challenge.getPendingRewards(bob);
    
    console.log("\nFinal Results:");
    console.log("   Alice rewards:", aliceRewards);
    console.log("   Bob rewards:", bobRewards);
    
    assertTrue(aliceRewards > 0 && bobRewards > 0, "Both should get rewards");
    
    console.log("\nDemo Complete! Total time: ~95 seconds");
}

    // ============ QUICK DEMO WITH PRECISE TIMING ============

    function test_QuickDemo() public {
        // Initial setup
        vm.prank(owner);
        challenge.depositRewards{value: 0.1 ether}();
        
        // 0s: Propose
        vm.prank(alice);
        challenge.proposeBook("Quick Demo Book", "Demo Author");
        
        // 2s: Sponsor
        vm.prank(bob);
        challenge.sponsorBook{value: 0.01 ether}(0);
        
        // 4s: First vote
        vm.prank(charlie);
        challenge.voteOnBook(0);
        
        // 6s: Second vote - creates challenge
        vm.prank(owner);
        challenge.voteOnBook(0);
        
        // Get challenge end time
        (,,,, uint256 endTime, , , , ) = challenge.getChallenge(0);
        
        // 8s: Join challenge
        vm.prank(alice);
        challenge.joinChallenge{value: 0.001 ether}(0);
        
        vm.prank(bob);
        challenge.joinChallenge{value: 0.001 ether}(0);
        
        // Warp to submission window (45s from start)
        vm.warp(endTime - REVIEW_WINDOW + 1);
        
        // 46s: Submit reviews
        vm.prank(alice);
        challenge.submitReview(0, "QmQuickReview1");
        
        vm.prank(bob);
        challenge.submitReview(0, "QmQuickReview2");
        
        // Warp to voting (61s - right after challenge ends)
        vm.warp(endTime + 1);
        
        // 62s: Vote
        vm.prank(alice);
        challenge.voteForReview(0, 1);
        
        vm.prank(bob);
        challenge.voteForReview(0, 0);
        
        // Warp to after voting (81s)
        vm.warp(endTime + VOTING_DURATION + 1);
        
        // 82s: Complete
        vm.prank(owner);
        challenge.completeChallenge(0);
        
        // Verify completed
        (,,,,,,, bool rewardsDistributed,) = challenge.getChallenge(0);
        assertTrue(rewardsDistributed, "Challenge should be completed");
        
        // Log results
        console.log("Quick Demo Successful!");
        console.log("Total time: ~82 seconds");
        console.log("Alice rewards:", challenge.getPendingRewards(alice));
        console.log("Bob rewards:", challenge.getPendingRewards(bob));
    }

    // ============ TEST EACH PHASE SEPARATELY ============

    function test_ProposalAndVotingPhase() public {
        vm.prank(alice);
        challenge.proposeBook(BOOK_TITLE, BOOK_AUTHOR);
        
        vm.prank(publisher);
        challenge.sponsorBook{value: 0.01 ether}(0);
        
        // First vote
        vm.prank(bob);
        challenge.voteOnBook(0);
        
        // Second vote - should execute
        vm.prank(charlie);
        challenge.voteOnBook(0);
        
        // Verify challenge created
        uint256[] memory active = challenge.getActiveChallenges();
        assertEq(active.length, 1);
    }

    function test_SubmissionPhase() public {
        // Setup challenge
        test_ProposalAndVotingPhase();
        
        // Get challenge
        (,,,, uint256 endTime, , , , ) = challenge.getChallenge(0);
        
        // Join
        vm.prank(alice);
        challenge.joinChallenge{value: 0.001 ether}(0);
        
        // Warp to submission window
        vm.warp(endTime - REVIEW_WINDOW + 1);
        
        // Submit review
        vm.prank(alice);
        challenge.submitReview(0, REVIEW_HASH);
        
        // Verify review
        (address[] memory users, , ) = challenge.getReviews(0);
        assertEq(users.length, 1);
        assertEq(users[0], alice);
    }

    function test_VotingPhase() public {
        // Setup with two participants
        test_SubmissionPhase();
        
        // Bob joins
        vm.prank(bob);
        challenge.joinChallenge{value: 0.001 ether}(0);
        
        // Get challenge end time
        (,,,, uint256 endTime, , , , ) = challenge.getChallenge(0);
        
        // Warp to submission window
        vm.warp(endTime - REVIEW_WINDOW + 1);
        
        // Bob submits
        vm.prank(bob);
        challenge.submitReview(0, "QmBobReview");
        
        // Warp to voting
        vm.warp(endTime + 1);
        
        // Vote
        vm.prank(alice);
        challenge.voteForReview(0, 1); // Alice votes for Bob
        
        // Check upvotes
        (, , uint256[] memory upvotes) = challenge.getReviews(0);
        assertEq(upvotes[1], 1); // Bob's review should have 1 vote
    }

    function test_CompletionPhase() public {
        // Setup with votes
        test_VotingPhase();
        
        // Get challenge end time
        (,,,, uint256 endTime, , , , ) = challenge.getChallenge(0);
        
        // Warp to after voting
        vm.warp(endTime + VOTING_DURATION + 1);
        
        // Complete
        vm.prank(owner);
        challenge.completeChallenge(0);
        
        // Verify completed
        (,,,,,,, bool rewardsDistributed,) = challenge.getChallenge(0);
        assertTrue(rewardsDistributed);
    }

    // ============ EDGE CASE TESTS ============

    function test_CannotSubmitTooEarly() public {
        test_ProposalAndVotingPhase();
        
        vm.prank(alice);
        challenge.joinChallenge{value: 0.001 ether}(0);
        
        // Try to submit too early
        vm.expectRevert("Too early to submit");
        challenge.submitReview(0, REVIEW_HASH);
    }

    function test_CannotSubmitAfterDeadline() public {
        test_ProposalAndVotingPhase();
        
        vm.prank(alice);
        challenge.joinChallenge{value: 0.001 ether}(0);
        
        (,,,, uint256 endTime, , , , ) = challenge.getChallenge(0);
        
        // Warp to after challenge ends
        vm.warp(endTime + 1);
        
        vm.expectRevert("Submission period ended");
        challenge.submitReview(0, REVIEW_HASH);
    }

    function test_CannotVoteBeforeVoting() public {
        test_SubmissionPhase();
        
        (,,,, uint256 endTime, , , , ) = challenge.getChallenge(0);
        
        // Warp to just before end
        vm.warp(endTime - 1);
        
        vm.expectRevert("Challenge not ended");
        challenge.voteForReview(0, 0);
    }

    function test_CannotVoteAfterVotingEnds() public {
        test_VotingPhase();
        
        (,,,, uint256 endTime, , , , ) = challenge.getChallenge(0);
        
        // Warp to after voting
        vm.warp(endTime + VOTING_DURATION + 1);
        
        vm.expectRevert("Voting ended");
        challenge.voteForReview(0, 0);
    }

    // ============ HELPER FUNCTIONS ============

    function _getRevertMsg(bytes memory data) internal pure returns (string memory) {
        if (data.length < 68) return "No revert message";
        assembly {
            data := add(data, 0x04)
        }
        return abi.decode(data, (string));
    }
}