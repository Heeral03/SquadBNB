// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/SquadManager.sol";

contract DeploySquadManager is Script {
    function run() external {
        // Try to get private key from environment
        uint256 deployerPrivateKey;
        
        try vm.envUint("PRIVATE_KEY") returns (uint256 key) {
            deployerPrivateKey = key;
            console.log("Using private key from environment");
        } catch {
            // If not found, use a default (for local testing only!)
            console.log("WARNING: No PRIVATE_KEY found in environment");
            console.log("Please set PRIVATE_KEY in your .env file");
            revert("Set PRIVATE_KEY in environment");
        }
        
        address deployer = vm.addr(deployerPrivateKey);
        console.log("Deployer address:", deployer);
        console.log("Balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        SquadManager squadManager = new SquadManager();
        
        console.log("SquadManager deployed to:", address(squadManager));
        
        vm.stopBroadcast();
    }
}