// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/ChallengeManager.sol";

contract ChallengeManagerTest is Test {
    ChallengeManager public challengeManager;
    address public squadManagerAddress = address(0x123);
    address public owner = address(0x456);
    address public user1 = address(0x789);
    
    function setUp() public {
        vm.prank(owner);
        challengeManager = new ChallengeManager(squadManagerAddress);
    }
    
    function testDeployment() public {
        assertEq(address(challengeManager.squadManagerAddress()), squadManagerAddress);
        assertEq(challengeManager.owner(), owner);
        assertEq(challengeManager.getChallengeCount(), 0);
    }
    
    function testCreateChallenge() public {
        vm.prank(owner);
        challengeManager.createChallenge(
            "Weekly Reading Challenge",
            "Read for 7 days straight",
            "Reading Streak",
            7,
            100
        );
        
        assertEq(challengeManager.getChallengeCount(), 1);
        
        ChallengeManager.Challenge memory challenge = challengeManager.getChallenge(0);
        assertEq(challenge.title, "Weekly Reading Challenge");
        assertEq(challenge.description, "Read for 7 days straight");
        assertEq(challenge.theme, "Reading Streak");
        assertEq(challenge.bonusPoints, 100);
        assertTrue(challenge.endTime > challenge.startTime);
    }
    
    function testCompleteChallenge() public {
        vm.prank(owner);
        challengeManager.createChallenge(
            "Test Challenge",
            "Description",
            "Theme",
            1,
            50
        );
        
        vm.prank(user1);
        challengeManager.completeChallenge(0);
        
        assertTrue(challengeManager.hasUserCompleted(0, user1));
        
        ChallengeManager.UserChallenge[] memory userChallenges = challengeManager.getUserChallenges(user1);
        assertEq(userChallenges.length, 1);
        assertEq(userChallenges[0].challengeId, 0);
    }
    
    function testCannotCompleteExpiredChallenge() public {
        vm.prank(owner);
        challengeManager.createChallenge(
            "Test Challenge",
            "Description",
            "Theme",
            1,
            50
        );
        
        vm.warp(block.timestamp + 2 days);
        
        vm.prank(user1);
        vm.expectRevert("Challenge expired");
        challengeManager.completeChallenge(0);
    }
    
    function testGetActiveChallenge() public {
        vm.prank(owner);
        challengeManager.createChallenge(
            "Active Challenge",
            "Description",
            "Theme",
            7,
            100
        );
        
        ChallengeManager.Challenge memory active = challengeManager.getActiveChallenge();
        assertEq(active.title, "Active Challenge");
    }
}