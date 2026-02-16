// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SquadManager.sol";
import "../src/SquadBadges.sol";

contract BadgeIntegrationTest is Test {
    SquadManager public squadManager;
    SquadBadges public badges;
    
    address public owner = address(0x123);
    address public user1 = address(0x456);
    address public user2 = address(0x789);
    address public user3 = address(0x999);
    
    string constant SQUAD_NAME = "BookWorms";
    string constant IPFS_HASH = "QmTest123";
    string constant TEST_QUOTE = "This is a test quote from the book";
    string constant CHALLENGE_DAY = "2026-02-13";

    function setUp() public {
        vm.startPrank(owner);
        squadManager = new SquadManager();
        badges = new SquadBadges(address(squadManager));
        
        squadManager.setBadgesAddress(address(badges));
        vm.stopPrank();
        
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
        vm.deal(user3, 10 ether);
        
        vm.warp(1000000);
    }

    function testBadgeMintingAfterVerification() public {
        // Create squad
        vm.prank(user1);
        squadManager.createSquad(SQUAD_NAME);
        
        // Add 3 verifiers (threshold is 3)
        vm.prank(user2);
        squadManager.joinSquad(SQUAD_NAME);
        vm.prank(user3);
        squadManager.joinSquad(SQUAD_NAME);
        
        // User2 submits
        vm.prank(user2);
        squadManager.submit(IPFS_HASH, TEST_QUOTE, CHALLENGE_DAY);
        
        // Need 3 verifications to reach threshold
        // First verification
        vm.warp(block.timestamp + 1 days + 1);
        vm.prank(user1);
        squadManager.verifySubmission(SQUAD_NAME, 0);
        
        // Second verification
        vm.warp(block.timestamp + 1 days + 1);
        vm.prank(user3);
        squadManager.verifySubmission(SQUAD_NAME, 0);
        
        // Third verification - this should trigger badge minting
        vm.warp(block.timestamp + 1 days + 1);
        vm.prank(owner);
        squadManager.joinSquad(SQUAD_NAME);
        vm.prank(owner);
        squadManager.verifySubmission(SQUAD_NAME, 0);
        
        // Now check if badge was minted
        assertTrue(badges.hasBadge(user2, SquadBadges.BadgeType.FIRST_SUBMISSION));
        assertEq(badges.getBadgeCount(user2), 1);
    }
}