// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/SquadBadges.sol";
import "../src/SquadManager.sol";

contract SquadBadgesTest is Test {
    SquadBadges public badges;
    SquadManager public squadManager;
    
    address public owner = address(0x123);
    address public user1 = address(0x456);
    address public user2 = address(0x789);
    address public attacker = address(0x999);
    
    string constant SQUAD_NAME = "BookWorms";
    string constant IPFS_HASH = "QmTest123";
    string constant TEST_QUOTE = "This is a test quote";
    string constant CHALLENGE_DAY = "2026-02-13";

    function setUp() public {
        vm.startPrank(owner);
        squadManager = new SquadManager();
        badges = new SquadBadges(address(squadManager));
        
        // Set badges address in SquadManager
        squadManager.setBadgesAddress(address(badges));
        vm.stopPrank();
        
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
        vm.deal(owner, 10 ether);
    }

    // ============ CONSTRUCTOR TESTS ============
    
    function testConstructor() public {
        assertEq(address(badges.squadManagerAddress()), address(squadManager));
        assertEq(badges.name(), "SquadBadges");
        assertEq(badges.symbol(), "SBDG");
        assertEq(badges.totalSupply(), 0);
        assertEq(badges.owner(), owner);
    }

    function testConstructorWithZeroAddress() public {
        vm.prank(owner);
        vm.expectRevert("Invalid SquadManager address");
        new SquadBadges(address(0));
    }

    // ============ ONLY SQUAD MANAGER TESTS ============
    
    function testOnlySquadManagerCanMint() public {
        vm.prank(address(squadManager));
        uint256 tokenId = badges.mintBadge(user1, SquadBadges.BadgeType.FIRST_SUBMISSION);
        assertEq(tokenId, 1);
    }

    function testNonSquadManagerCannotMint() public {
        vm.prank(user1);
        vm.expectRevert("Only SquadManager can mint");
        badges.mintBadge(user2, SquadBadges.BadgeType.FIRST_SUBMISSION);
    }

    // ============ MINTING TESTS ============
    
    function testMintBadge() public {
        vm.prank(address(squadManager));
        uint256 tokenId = badges.mintBadge(user1, SquadBadges.BadgeType.FIRST_SUBMISSION);
        
        assertEq(tokenId, 1);
        assertEq(badges.ownerOf(tokenId), user1);
        assertEq(badges.totalSupply(), 1);
        assertEq(badges.getBadgeCount(user1), 1);
        
        SquadBadges.Badge memory badge = badges.getBadgeDetails(tokenId);
        assertEq(uint256(badge.badgeType), uint256(SquadBadges.BadgeType.FIRST_SUBMISSION));
        assertTrue(badge.mintedAt > 0);
    }

    function testBatchMintBadges() public {
        SquadBadges.BadgeType[] memory badgeTypes = new SquadBadges.BadgeType[](3);
        badgeTypes[0] = SquadBadges.BadgeType.FIRST_SUBMISSION;
        badgeTypes[1] = SquadBadges.BadgeType.TEN_SUBMISSIONS;
        badgeTypes[2] = SquadBadges.BadgeType.VERIFIER_HERO;
        
        vm.prank(address(squadManager));
        badges.batchMintBadges(user1, badgeTypes);
        
        assertEq(badges.getBadgeCount(user1), 3);
        assertEq(badges.totalSupply(), 3);
    }

    // ============ VIEW FUNCTION TESTS ============
    
    function testHasBadge() public {
        vm.prank(address(squadManager));
        badges.mintBadge(user1, SquadBadges.BadgeType.FIRST_SUBMISSION);
        
        assertTrue(badges.hasBadge(user1, SquadBadges.BadgeType.FIRST_SUBMISSION));
        assertFalse(badges.hasBadge(user1, SquadBadges.BadgeType.TEN_SUBMISSIONS));
    }

    function testGetUserBadges() public {
        vm.startPrank(address(squadManager));
        uint256 tokenId1 = badges.mintBadge(user1, SquadBadges.BadgeType.FIRST_SUBMISSION);
        uint256 tokenId2 = badges.mintBadge(user1, SquadBadges.BadgeType.TEN_SUBMISSIONS);
        vm.stopPrank();
        
        uint256[] memory userBadges = badges.getUserBadges(user1);
        assertEq(userBadges.length, 2);
        assertEq(userBadges[0], tokenId1);
        assertEq(userBadges[1], tokenId2);
    }

    // ============ SQUAD MANAGER UPDATE TESTS ============
    
    function testUpdateSquadManager() public {
        address newManager = address(0xabc);
        
        vm.prank(owner);
        badges.updateSquadManager(newManager);
        
        assertEq(address(badges.squadManagerAddress()), newManager);
    }

    function testNonOwnerCannotUpdateSquadManager() public {
        vm.prank(user1);
        vm.expectRevert();
        badges.updateSquadManager(address(0xabc));
    }
}