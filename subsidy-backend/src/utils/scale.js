import { parseUnits, formatUnits } from 'ethers';

export const SCALING = 18; // contract uses 1e18

export const toScaled = (n) => parseUnits(String(n), SCALING);      // => BigInt
export const fromScaled = (bn) => formatUnits(bn, SCALING);         // => string

export const kgToScaled = toScaled;
export const inrToScaled = toScaled;
export const weiToEth = (wei) => formatUnits(wei, 18);
