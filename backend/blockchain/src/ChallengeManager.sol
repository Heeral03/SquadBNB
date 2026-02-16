// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ChallengeManager is Ownable {
    // Your existing SquadManager address
    address public squadManagerAddress;
    
    struct Challenge {
        uint256 id;
        string title;
        string description;
        string theme;
        uint256 startTime;
        uint256 endTime;
        uint256 bonusPoints;
        bool active;
        uint256 participantCount;
    }
    
    struct UserChallenge {
        uint256 challengeId;
        uint256 completedAt;
        bool claimed;
    }
    
    Challenge[] public challenges;
    mapping(address => UserChallenge[]) public userChallenges;
    mapping(uint256 => mapping(address => bool)) public hasCompleted;
    
    event ChallengeCreated(uint256 indexed id, string title, uint256 endTime);
    event ChallengeCompleted(uint256 indexed id, address indexed user, uint256 bonusPoints);
    
    constructor(address _squadManagerAddress) Ownable(msg.sender) {
        squadManagerAddress = _squadManagerAddress;
    }
    
    // Admin: Create new challenge
    function createChallenge(
        string calldata _title,
        string calldata _description,
        string calldata _theme,
        uint256 _durationInDays,
        uint256 _bonusPoints
    ) external onlyOwner {
        uint256 challengeId = challenges.length;
        
        challenges.push(Challenge({
            id: challengeId,
            title: _title,
            description: _description,
            theme: _theme,
            startTime: block.timestamp,
            endTime: block.timestamp + (_durationInDays * 1 days),
            bonusPoints: _bonusPoints,
            active: true,
            participantCount: 0
        }));
        
        emit ChallengeCreated(challengeId, _title, block.timestamp + (_durationInDays * 1 days));
    }
    
    // User: Complete challenge
    function completeChallenge(uint256 _challengeId) external {
        Challenge storage challenge = challenges[_challengeId];
        require(block.timestamp < challenge.endTime, "Challenge expired");
        require(!hasCompleted[_challengeId][msg.sender], "Already completed");
        
        // Mark as completed
        hasCompleted[_challengeId][msg.sender] = true;
        challenge.participantCount++;
        
        userChallenges[msg.sender].push(UserChallenge({
            challengeId: _challengeId,
            completedAt: block.timestamp,
            claimed: false
        }));
        
        emit ChallengeCompleted(_challengeId, msg.sender, challenge.bonusPoints);
    }
    
    // Get active challenge
    function getActiveChallenge() external view returns (Challenge memory) {
        for (uint256 i = challenges.length; i > 0; i--) {
            if (challenges[i-1].endTime > block.timestamp) {
                return challenges[i-1];
            }
        }
        revert("No active challenge");
    }
    
    // Get user's challenge history
    function getUserChallenges(address _user) external view returns (UserChallenge[] memory) {
        return userChallenges[_user];
    }
    
    // Check if user completed specific challenge
    function hasUserCompleted(uint256 _challengeId, address _user) external view returns (bool) {
        return hasCompleted[_challengeId][_user];
    }
    
    // Get challenge count
    function getChallengeCount() external view returns (uint256) {
        return challenges.length;
    }
    // Add this function to ChallengeManager.sol
function getChallenge(uint256 _challengeId) external view returns (Challenge memory) {
    require(_challengeId < challenges.length, "Challenge doesn't exist");
    return challenges[_challengeId];
}
}