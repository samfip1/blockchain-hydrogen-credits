// scripts/computeSubsidy.mjs
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const __dirname = path.resolve();
const abi = JSON.parse(fs.readFileSync(path.join(__dirname, "src/abi/GreenHydrogenSimulator.abi.json"), "utf8"));

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

async function main() {
  try {
    const projectId = 5; // adjust
    const subsidyRate = ethers.parseUnits("50", 18); // 50 INR/kg

    const [amountINR, amountETH] = await contract.computeSubsidyForProject(projectId, subsidyRate);

    console.log(" Subsidy (INR scaled):", amountINR.toString());
    console.log(" Subsidy (ETH wei):", amountETH.toString());
  } catch (err) {
    console.error(" Error:", err);
  }
}

main();
