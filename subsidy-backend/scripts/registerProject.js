// registerProject.js   New
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Load ABI from the ABI file you already generated
const __dirname = path.resolve();
const abiPath = path.join(__dirname, "src/abi", "GreenHydrogenSimulator.abi.json");
const contractAbi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

// Contract address (already deployed)
const contractAddress = process.env.CONTRACT_ADDRESS;
if (!contractAddress) {
  throw new Error("❌ CONTRACT_ADDRESS not set in .env");
}

// Setup provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract instance
const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

async function registerDemoProject() {
  try {
    console.log("🚀 Registering demo project...");

    // Static parameters for testing
    const _producer = "0xd9145CCE52D386f254917e481eB44e9943F39138";
    const _state = "GUJRAT(kutch)";
    const _scheme = "SIGHT-Product3";
    const _milestoneTargetScaled = 1500000; // example value (scaled)

    // Call registerProject
    const tx = await contract.registerProject(
      _producer,
      _state,
      _scheme,
      _milestoneTargetScaled
    );

    console.log("📡 Transaction sent. Hash:", tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("✅ Transaction mined in block:", receipt.blockNumber);

   

  } catch (err) {
    console.error("❌ Error registering project:", err);
  }
}

// Run
registerDemoProject();
