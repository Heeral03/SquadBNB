// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SquadBadges is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenIds;
    
    // Reference to your SquadManager contract
    address public squadManagerAddress;
    
    // Badge types (matches achievements from SquadManager)
    enum BadgeType {
        FIRST_SUBMISSION,    // 0 - When user has 1 submission
        TEN_SUBMISSIONS,     // 1 - When user has 10 submissions
        FIFTY_SUBMISSIONS,   // 2 - When user has 50 submissions
        HUNDRED_SUBMISSIONS, // 3 - When user has 100 submissions
        VERIFIER_HERO,       // 4 - When user has 5 verified submissions
        SQUAD_CHAMPION       // 5 - When user has 20 points
    }

    struct Badge {
        BadgeType badgeType;
        uint256 mintedAt;
        string metadataURI;
    }

    mapping(address => uint256[]) public userBadges;
    mapping(uint256 => Badge) public badgeDetails;
    
    // Badge metadata
    string[] public badgeNames = [
        "First Submission",
        "10 Submissions", 
        "50 Submissions",
        "100 Submissions",
        "Verifier Hero",
        "Squad Champion"
    ];

    string[] public badgeDescriptions = [
        "Submitted your first challenge",
        "Made 10 submissions",
        "Made 50 submissions", 
        "Made 100 submissions",
        "Verified 5 submissions",
        "Scored 20 points"
    ];

    // Events
    event BadgeMinted(address indexed user, BadgeType badgeType, uint256 tokenId);
    event SquadManagerUpdated(address indexed oldManager, address indexed newManager);
    event BadgeMetadataUpdated(uint256 indexed tokenId, string metadataURI);

    constructor(address _squadManagerAddress) ERC721("SquadBadges", "SBDG") Ownable(msg.sender) {
        require(_squadManagerAddress != address(0), "Invalid SquadManager address");
        squadManagerAddress = _squadManagerAddress;
        _tokenIds = 0;
    }

    // Modifier to allow only SquadManager to mint badges
    modifier onlySquadManager() {
        require(msg.sender == squadManagerAddress, "Only SquadManager can mint");
        _;
    }

    // Update SquadManager address (in case it changes)
    function updateSquadManager(address _newSquadManagerAddress) external onlyOwner {
        require(_newSquadManagerAddress != address(0), "Invalid address");
        address oldManager = squadManagerAddress;
        squadManagerAddress = _newSquadManagerAddress;
        emit SquadManagerUpdated(oldManager, _newSquadManagerAddress);
    }

    // Mint badge for user - Can only be called by SquadManager
    function mintBadge(address user, BadgeType badgeType) external onlySquadManager returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _mint(user, newTokenId);
        
        badgeDetails[newTokenId] = Badge({
            badgeType: badgeType,
            mintedAt: block.timestamp,
            metadataURI: ""
        });

        userBadges[user].push(newTokenId);

        emit BadgeMinted(user, badgeType, newTokenId);
        
        return newTokenId;
    }

    // Batch mint badges - Called by SquadManager
    function batchMintBadges(address user, BadgeType[] calldata badgeTypes) external onlySquadManager {
        for (uint i = 0; i < badgeTypes.length; i++) {
            _tokenIds++;
            uint256 newTokenId = _tokenIds;

            _mint(user, newTokenId);
            
            badgeDetails[newTokenId] = Badge({
                badgeType: badgeTypes[i],
                mintedAt: block.timestamp,
                metadataURI: ""
            });

            userBadges[user].push(newTokenId);
            
            emit BadgeMinted(user, badgeTypes[i], newTokenId);
        }
    }

    // Update badge metadata (for IPFS images)
    function updateBadgeMetadata(uint256 tokenId, string calldata metadataURI) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Badge does not exist");
        badgeDetails[tokenId].metadataURI = metadataURI;
        emit BadgeMetadataUpdated(tokenId, metadataURI);
    }

    // View functions
    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userBadges[user];
    }

    function getBadgeDetails(uint256 tokenId) external view returns (Badge memory) {
        require(_ownerOf(tokenId) != address(0), "Badge does not exist");
        return badgeDetails[tokenId];
    }

    function getBadgeCount(address user) external view returns (uint256) {
        return userBadges[user].length;
    }

    function hasBadge(address user, BadgeType badgeType) external view returns (bool) {
        uint256[] memory badges = userBadges[user];
        for (uint i = 0; i < badges.length; i++) {
            if (badgeDetails[badges[i]].badgeType == badgeType) {
                return true;
            }
        }
        return false;
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIds;
    }

    // Token URI for metadata
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Badge does not exist");
        
        Badge memory badge = badgeDetails[tokenId];
        
        if (bytes(badge.metadataURI).length > 0) {
            return badge.metadataURI;
        }
        
        // Return default metadata
        return string(abi.encodePacked(
            "data:application/json;utf8,{",
            '"name":"', badgeNames[uint256(badge.badgeType)], '",',
            '"description":"', badgeDescriptions[uint256(badge.badgeType)], '",',
            '"image":"ipfs://QmDefaultBadgeImage"',
            "}"
        ));
    }
}