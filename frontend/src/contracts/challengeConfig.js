export const CHALLENGE_MANAGER_ADDRESS = '0x9215fA79167a6f956498fBe052E4146CbC8914c6';
import ChallengeManagerABI from './ChallengeManager.json';
export const CHALLENGE_MANAGER_ABI = ChallengeManagerABI;
// export const CHALLENGE_MANAGER_ABI = [
//   {
//     "inputs": [{"internalType": "address", "name": "_squadManagerAddress", "type": "address"}],
//     "stateMutability": "nonpayable",
//     "type": "constructor"
//   },
//   {
//     "inputs": [
//       {"internalType": "string", "name": "_title", "type": "string"},
//       {"internalType": "string", "name": "_description", "type": "string"},
//       {"internalType": "string", "name": "_theme", "type": "string"},
//       {"internalType": "uint256", "name": "_durationInDays", "type": "uint256"},
//       {"internalType": "uint256", "name": "_bonusPoints", "type": "uint256"}
//     ],
//     "name": "createChallenge",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "uint256", "name": "_challengeId", "type": "uint256"}],
//     "name": "completeChallenge",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "getActiveChallenge",
//     "outputs": [{
//       "components": [
//         {"internalType": "uint256", "name": "id", "type": "uint256"},
//         {"internalType": "string", "name": "title", "type": "string"},
//         {"internalType": "string", "name": "description", "type": "string"},
//         {"internalType": "string", "name": "theme", "type": "string"},
//         {"internalType": "uint256", "name": "startTime", "type": "uint256"},
//         {"internalType": "uint256", "name": "endTime", "type": "uint256"},
//         {"internalType": "uint256", "name": "bonusPoints", "type": "uint256"},
//         {"internalType": "bool", "name": "active", "type": "bool"},
//         {"internalType": "uint256", "name": "participantCount", "type": "uint256"}
//       ],
//       "internalType": "struct ChallengeManager.Challenge",
//       "name": "",
//       "type": "tuple"
//     }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "uint256", "name": "_challengeId", "type": "uint256"}, {"internalType": "address", "name": "_user", "type": "address"}],
//     "name": "hasUserCompleted",
//     "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
//     "name": "getUserChallenges",
//     "outputs": [{
//       "components": [
//         {"internalType": "uint256", "name": "challengeId", "type": "uint256"},
//         {"internalType": "uint256", "name": "completedAt", "type": "uint256"},
//         {"internalType": "bool", "name": "claimed", "type": "bool"}
//       ],
//       "internalType": "struct ChallengeManager.UserChallenge[]",
//       "name": "",
//       "type": "tuple[]"
//     }],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "getChallengeCount",
//     "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
//     "stateMutability": "view",
//     "type": "function"
//   }
// ];