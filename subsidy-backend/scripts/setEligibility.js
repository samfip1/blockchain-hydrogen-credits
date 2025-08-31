// scripts/setEligibility.mjs
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
    const projectId = 5; // adjust to your registered project

    const tx = await contract.setEligibilityCriteria(
      projectId,
      ethers.parseUnits("2", 18), // maxCarbonIntensityScaled (2 CO2e/kg)
      true,                       // renewableSourceRequired
      30,                         // minLVAPercent
      true                        // equipmentApproved
    );

    console.log("📡 Tx Hash:", tx.hash);
    await tx.wait();
    console.log(`✅ Eligibility set for project ${projectId}`);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

main();
