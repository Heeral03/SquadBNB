// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/SquadBadges.sol";

contract DeployBadges is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address squadManagerAddress = vm.envAddress("SQUAD_MANAGER_ADDRESS");
        
        console.log("Deploying SquadBadges...");
        console.log("SquadManager address:", squadManagerAddress);
        console.log("Deployer address:", vm.addr(deployerPrivateKey));
        
        vm.startBroadcast(deployerPrivateKey);
        
        SquadBadges badges = new SquadBadges(squadManagerAddress);
        
        console.log("SquadBadges deployed to:", address(badges));
        
        vm.stopBroadcast();
    }
}