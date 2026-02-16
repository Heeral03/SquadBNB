// script/DeployDemo.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/MonthlyChallengesDemo.sol";

contract DeployDemo is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address squadManagerAddress = vm.envAddress("SQUAD_MANAGER_ADDRESS");
        
        console.log("Deploying MonthlyChallengeDemo...");
        console.log("SquadManager:", squadManagerAddress);
        
        vm.startBroadcast(deployerPrivateKey);
        
        MonthlyChallengeDemo demo = new MonthlyChallengeDemo(squadManagerAddress);
        
        console.log(" Demo contract deployed at:", address(demo));
        console.log(" Challenge duration:", demo.CHALLENGE_DURATION(), "seconds");
        console.log(" Voting duration:", demo.VOTING_DURATION(), "seconds");
        
        vm.stopBroadcast();
    }
}