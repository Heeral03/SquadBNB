// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/ChallengeManager.sol";

contract DeployChallengeManager is Script {
    // Configuration
    address constant SQUAD_MANAGER_ADDRESS = 0x0C7367866eba7d72648cC17b6640f8424A1Db05f; // Your deployed SquadManager
    
    function run() external {
        // Get private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=========================================");
        console.log("Deploying ChallengeManager");
        console.log("=========================================");
        console.log("Deployer address:", deployer);
        console.log("Deployer balance:", deployer.balance);
        console.log("SquadManager address:", SQUAD_MANAGER_ADDRESS);
        console.log("Chain ID:", block.chainid);
        console.log("=========================================");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy ChallengeManager
        ChallengeManager challengeManager = new ChallengeManager(SQUAD_MANAGER_ADDRESS);
        
        console.log("ChallengeManager deployed!");
        console.log("Contract address:", address(challengeManager));
        console.log("Owner:", challengeManager.owner());
        console.log("SquadManager address:", challengeManager.squadManagerAddress());
        console.log("Initial challenge count:", challengeManager.getChallengeCount());
        
        vm.stopBroadcast();
        
        console.log("=========================================");
        console.log("Deployment complete!");
        console.log("Verify on BSCScan:");
        console.log("https://testnet.bscscan.com/address/", address(challengeManager));
        console.log("=========================================");
    }
}