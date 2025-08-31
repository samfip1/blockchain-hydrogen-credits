import 'dotenv/config';

export const CONFIG = {
  rpcUrl: process.env.RPC_URL,
  privateKey: process.env.PRIVATE_KEY,
  contractAddress: process.env.CONTRACT_ADDRESS,
  port: Number(process.env.PORT || 8080),

  // off-chain scheme defaults
  defaultScheme: process.env.DEFAULT_SCHEME || 'SIGHT-Production',
  prodRateInr: process.env.PROD_RATE_INR ? Number(process.env.PROD_RATE_INR) : 50, // INR/kg
  ethInrRate: process.env.ETH_INR_RATE ? Number(process.env.ETH_INR_RATE) : 250000 // INR/ETH
};

['rpcUrl','privateKey','contractAddress'].forEach((k) => {
  if (!CONFIG[k]) throw new Error(`Missing env: ${k}`);
});
