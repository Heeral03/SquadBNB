// SPDX-License-Identifier: MIT

// Import ABIs from JSON files
import MonthlyChallengeJSON from './MonthlyChallenges.json';
import SquadManagerJSON from './SquadManager.json';

// Your deployed SquadManager contract address (UPDATED!)
export const SQUAD_MANAGER_ADDRESS = '0xf12542ac678e7C6b65E14e9f8C122B7a49Bd0950';

// Your deployed SquadBadges contract address  
export const BADGES_CONTRACT_ADDRESS = '0x5Fb509c6bEdf3a5dB0c63ac8E0f44dd79998D2Bf';

// Your deployed MonthlyChallenge contract address
export const MONTHLY_CHALLENGE_ADDRESS = '0x7C71dB4269183c0177a1D04ADe407fD93256200a';

// Monthly Challenge ABI - Imported from JSON file
export const MONTHLY_CHALLENGE_ABI = MonthlyChallengeJSON.abi || MonthlyChallengeJSON;

// Squad Manager ABI - Imported from JSON file
export const SQUAD_MANAGER_ABI = SquadManagerJSON.abi || SquadManagerJSON;

// Other contract addresses
export const DAILY_CHALLENGE_ADDRESS = '0x9215fA79167a6f956498fBe052E4146CbC8914c6';
export const CHALLENGE_MANAGER_ADDRESS = '0xc2dae969149a8715dD4021149b38dBF99Fd91AE0';