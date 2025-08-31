// scripts/submitSensor.mjs
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
    const tx = await contract.submitSensorData(
      projectId,
      ethers.parseUnits("600", 18),   // hydrogenProducedScaled
      ethers.parseUnits("1.5", 18),   // carbonIntensityScaled
      70,                             // renewablePercentage
      "Oracle-1",                     // source
      "QmDummyCID1234567890"          // ipfsReportCid
    );

    console.log("📡 Tx Hash:", tx.hash);
    const receipt = await tx.wait();
    console.log(`✅ Sensor data submitted in block ${receipt.blockNumber}`);

    const count = await contract.sensorCount();
    console.log("📊 Sensor Count:", count.toString());
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

main();
