// script/DeployMonthlyChallenge.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/MonthlyChallenges.sol";

contract DeployMonthlyChallenge is Script {
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address squadManagerAddress = vm.envAddress("SQUAD_MANAGER_ADDRESS");
        address deployer = vm.addr(deployerPrivateKey);
        
        // Validate inputs
        require(squadManagerAddress != address(0), "SQUAD_MANAGER_ADDRESS cannot be zero");
        
        // Log deployment info
        console.log("=========================================");
        console.log("Deploying MonthlyChallenge");
        console.log("=========================================");
        console.log("Network:", block.chainid);
        console.log("Deployer:", deployer);
        console.log("Deployer balance:", deployer.balance);
        console.log("SquadManager:", squadManagerAddress);
        
        // Start broadcast
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy contract
        MonthlyChallenge challenge = new MonthlyChallenge(squadManagerAddress);
        
        // Optional: Fund the reward pool immediately
        // uint256 initialFund = 0.05 ether;
        // challenge.depositRewards{value: initialFund}();
        
        console.log("\n MonthlyChallenge deployed!");
        console.log("Contract address:", address(challenge));
        
        // Log contract state
        console.log("\nContract State:");
        console.log("VOTES_REQUIRED:", challenge.VOTES_REQUIRED());
        console.log("CHALLENGE_ENTRY_FEE:", challenge.CHALLENGE_ENTRY_FEE());
        console.log("REWARD POOL:", challenge.rewardPool());
        
        vm.stopBroadcast();
        
        // Next steps
        console.log("\n NEXT STEPS:");
        console.log("1. Fund the reward pool:");
        console.log("   cast send", address(challenge), "\"depositRewards()\" --value 0.05ether --private-key $PRIVATE_KEY");
        console.log("2. Verify on explorer:");
        console.log("   forge verify-contract", address(challenge), "MonthlyChallenge \\");
        console.log("     --chain-id", block.chainid, "\\");
        console.log("     --constructor-args $(cast abi-encode 'constructor(address)'", squadManagerAddress, ")");
        console.log("3. Create first proposal:");
        console.log("   cast send", address(challenge), "\"proposeBook(string,string)\" \"The Alchemist\" \"Paulo Coelho\" --private-key $PRIVATE_KEY");
    }
}