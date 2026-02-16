// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/DailyChallenge.sol";

// Mock SquadManager for testing
contract MockSquadManager {
    struct UserProfile {
        string squadName;
        uint256 totalScore;
        uint256 joinDate;
        uint256 submissionsCount;
        uint256 lastSubmissionTime;
        uint256 verificationCount;
    }
    
    mapping(address => UserProfile) public users;
    mapping(address => uint256) public userPoints;
    mapping(string => bool) public squads;
    
    event PointsAdded(address indexed user, uint256 points);
    
    function joinSquad(string calldata squadName, address user) external {
        squads[squadName] = true;
        users[user] = UserProfile({
            squadName: squadName,
            totalScore: 0,
            joinDate: block.timestamp,
            submissionsCount: 0,
            lastSubmissionTime: 0,
            verificationCount: 0
        });
    }
    
    function getUserProfile(address user) external view returns (
        string memory squadName,
        uint256 totalScore,
        uint256 joinDate,
        uint256 submissionsCount,
        uint256 lastSubmissionTime,
        uint256 verificationCount
    ) {
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
    
    function addPoints(address user, uint256 points) external {
        userPoints[user] += points;
        users[user].totalScore += points;
        emit PointsAdded(user, points);
    }
}

contract DailyChallengeTest is Test {
    DailyChallenge public dailyChallenge;
    MockSquadManager public squadManager;
    
    address public owner;
    address public user1;
    address public user2;
    address public user3;
    
    string constant SQUAD_NAME = "TestSquad";
    string constant IPFS_HASH = "QmTest123";
    string constant TEST_QUOTE = "This is a test quote from my book";

    function setUp() public {
        owner = makeAddr("owner");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        user3 = makeAddr("user3");
        
        vm.startPrank(owner);
        squadManager = new MockSquadManager();
        
        squadManager.joinSquad(SQUAD_NAME, user1);
        squadManager.joinSquad(SQUAD_NAME, user2);
        squadManager.joinSquad(SQUAD_NAME, user3);
        
        dailyChallenge = new DailyChallenge(address(squadManager));
        vm.stopPrank();
    }

    function testGenerateDailyChallenge() public {
        vm.prank(user1);
        dailyChallenge.generateDailyChallenge();
        
        DailyChallenge.Challenge memory challenge = dailyChallenge.getCurrentChallenge();
        assertTrue(bytes(challenge.title).length > 0);
        assertTrue(challenge.bonusPoints >= 20 && challenge.bonusPoints <= 50);
    }

    function testSubmitDailyChallenge() public {
        vm.prank(user1);
        dailyChallenge.generateDailyChallenge();
        
        uint256 today = block.timestamp / 1 days;
        
        vm.prank(user1);
        dailyChallenge.submitDailyChallenge(IPFS_HASH, TEST_QUOTE);
        
        (address submitter, string memory ipfsHash, string memory quote, uint256 timestamp, bool verified, uint256 verifierCount) = 
            dailyChallenge.getDailySubmission(today, user1);
        
        assertEq(submitter, user1);
        assertEq(ipfsHash, IPFS_HASH);
        assertEq(quote, TEST_QUOTE);
        assertTrue(timestamp > 0);
        assertFalse(verified);
        assertEq(verifierCount, 0);
    }

    function testVerifyDailySubmission() public {
        vm.prank(user1);
        dailyChallenge.generateDailyChallenge();
        
        vm.prank(user1);
        dailyChallenge.submitDailyChallenge(IPFS_HASH, TEST_QUOTE);
        
        vm.prank(user2);
        dailyChallenge.verifyDailySubmission(user1);
        
        uint256 today = block.timestamp / 1 days;
        ( , , , , bool verified, uint256 verifierCount) = dailyChallenge.getDailySubmission(today, user1);
        
        assertTrue(verified);
        assertEq(verifierCount, 1);
    }
}