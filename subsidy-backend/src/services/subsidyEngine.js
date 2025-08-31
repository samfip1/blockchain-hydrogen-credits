import { inrToScaled, toScaled } from '../utils/scale.js';
import { CONFIG } from '../config.js';
import { simulator } from '../chains/contract.js';

const SCHEMES = {
  'SIGHT-Production': {
    type: 'ProductionPerKg',
    rateINR: CONFIG.prodRateInr // INR/kg unscaled number
  }
  // add more schemes/state variants here if needed
};

export function resolveRateForScheme(scheme) {
  const s = SCHEMES[scheme] || SCHEMES[CONFIG.defaultScheme];
  return inrToScaled(s.rateINR); // BigInt scaled 1e18
}

export async function pushEthInrRateToChainIfChanged() {
  // Optional: set on-chain rate if your backend is the source of truth
  const desired = toScaled(CONFIG.ethInrRate); // INR * 1e18
  // call setEthInrRate(desired)
  try {
    const tx = await simulator.setEthInrRate(desired);
    await tx.wait();
    return { updated: true, sent: String(desired) };
  } catch (e) {
    // likely reverts if same value or not owner; safe to ignore for demo
    return { updated: false, reason: e.shortMessage || e.message };
  }
}
