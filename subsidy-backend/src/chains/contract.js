import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Contract } from 'ethers';
import { provider, signer } from './provider.js';
import { CONFIG } from '../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const abiPath = path.join(__dirname, '..', 'abi', 'GreenHydrogenSimulator.abi.json');
const ABI = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

export const simulator = new Contract(CONFIG.contractAddress, ABI, signer);
export const simulatorRO = simulator.connect(provider); // read-only
