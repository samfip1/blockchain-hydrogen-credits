import { JsonRpcProvider, Wallet } from 'ethers';
import { CONFIG } from '../config.js';

export const provider = new JsonRpcProvider(CONFIG.rpcUrl);
export const signer = new Wallet(CONFIG.privateKey, provider);
