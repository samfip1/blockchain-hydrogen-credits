import app from "./app.js";
import { CONFIG } from "./config.js";
import { attachEventListeners } from "./listeners/events.js";
import { ethers } from "ethers";
import fs from "fs";

// Attach blockchain/event listeners
attachEventListeners();

const PORT = CONFIG.port || 8080;

const server = app.listen(PORT, async () => {
  console.log(`✅ [API] Server is running at http://localhost:${PORT}`);
  console.log(``);

  try {
    // Load environment variables
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log(`🔑 Wallet Address: ${wallet.address}`);
    console.log(`📄 Contract Address: ${process.env.CONTRACT_ADDRESS}`);

    // Load ABI
    const abi = JSON.parse(fs.readFileSync("src/abi/GreenHydrogenSimulator.abi.json", "utf8"));

    // Create contract instance
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

    // Call projectCount from contract
    const projectCount = await contract.projectCount();
    console.log(`📊 Project Count: ${projectCount.toString()}`);

    console.log("✅ Getting eligibility...");
    const eligible = await contract.getSensor(1);

    console.log(`Sensor 1 Data:`, eligible);

  } catch (err) {
    console.error("❌ Error fetching project count:", err);
  }
});

// Handle errors (like EADDRINUSE: port already in use)
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Try another port.`);
    process.exit(1);
  } else {
    console.error("❌ Server error:", err);
    process.exit(1);
  }
});
