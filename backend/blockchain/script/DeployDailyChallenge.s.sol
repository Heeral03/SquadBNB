// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/DailyChallenge.sol";

contract DeployDailyChallenge is Script {
    function run() external {
        // Replace with your actual SquadManager address
        address SQUAD_MANAGER_ADDRESS = 0xf12542ac678e7C6b65E14e9f8C122B7a49Bd0950;
        
        // Get the deployer address from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deployer address:", deployer);
        
        vm.startBroadcast(deployerPrivateKey);
        
        DailyChallenge dailyChallenge = new DailyChallenge(SQUAD_MANAGER_ADDRESS);
        
        console.log("DailyChallenge deployed to:", address(dailyChallenge));
        console.log("SquadManager address:", SQUAD_MANAGER_ADDRESS);
        
        vm.stopBroadcast();
        
        // Verify the deployment
        console.log("\n=== Deployment Verification ===");
        console.log("Network: BSC Testnet (Chain ID: 97)");
        console.log("Contract Address:", address(dailyChallenge));
        console.log("Explorer URL:", string.concat("https://testnet.bscscan.com/address/", vm.toString(address(dailyChallenge))));
    }
}