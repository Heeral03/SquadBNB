// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/ChallengeManager.sol";

contract DeployChallenges is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address squadManagerAddress = vm.envAddress("SQUAD_MANAGER_ADDRESS");
        
        console.log("Deploying ChallengeManager...");
        console.log("SquadManager address:", squadManagerAddress);
        
        vm.startBroadcast(deployerPrivateKey);
        
        ChallengeManager challenges = new ChallengeManager(squadManagerAddress);
        
        console.log("ChallengeManager deployed to:", address(challenges));
        
        vm.stopBroadcast();
    }
}