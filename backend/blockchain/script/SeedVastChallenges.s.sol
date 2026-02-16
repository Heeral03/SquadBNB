// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.20;

// import "forge-std/Script.sol";
// import "../src/ChallengeManager.sol";

// contract SeedChallenges is Script {
//     function run() external {
//         uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
//         address challengeManagerAddress = 0x70cb4AF62051a8CD9bdFFcEb04867005310A79F4;
        
//         vm.startBroadcast(deployerPrivateKey);
        
//         ChallengeManager challenges = ChallengeManager(challengeManagerAddress);
        
//         // Challenge 1: Fantasy Theme
//         challenges.createChallenge(
//             "Fantasy Quest: Magical Creatures",
//             "Share a photo of a fantasy book featuring magical creatures. Tell us which creature you'd want as a companion!",
//             "Fantasy",
//             30, // 30 days
//             10  // 10 bonus points
//         );
//         console.log("Fantasy challenge created");
        
//         // Challenge 2: Sci-Fi Theme
//         challenges.createChallenge(
//             "Sci-Fi Future: AI & Robots",
//             "Read a sci-fi book about AI or robots. Share your thoughts: Will AI be friend or foe?",
//             "Sci-Fi",
//             30,
//             10
//         );
//         console.log("Sci-Fi challenge created");
        
//         // Challenge 3: Mystery Theme
//         challenges.createChallenge(
//             "Mystery Night: Unsolved!",
//             "Read a mystery/thriller. Take a photo with the book and share your best detective theory!",
//             "Mystery",
//             30,
//             10
//         );
//         console.log(" Mystery challenge created");
        
//         console.log("All 3 challenges seeded successfully!");
        
//         vm.stopBroadcast();
//     }
// }