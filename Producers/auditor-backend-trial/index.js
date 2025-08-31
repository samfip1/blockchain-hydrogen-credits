// auditor-mock.js
import express from "express";

const app = express();
app.use(express.json());

app.post("/evaluate", (req, res) => {
    // You receive the claim data here
    const { claimId, companyId, plantId, hydrogenProduced, energyConsumed } = req.body;

    console.log("Received claim for evaluation:", {
        claimId,
        companyId,
        plantId,
        hydrogenProduced,
        energyConsumed,
    });

    // Randomly approve/reject
    const approved = Math.random() > 0.3; // 70% chance to approve

    // Generate random subsidy amount if approved
    const subsidyAmount = approved ? parseFloat((Math.random() * 100000 + 50000).toFixed(2)) : 0;

    res.json({
        approved,
        subsidyAmount,
        remarks: approved ? "Claim approved by mock auditor" : "Claim rejected by mock auditor",
    });
});

// Start mock server
const PORT = 4000; // run it separately on port 4000
app.listen(PORT, () => {
    console.log(`Mock auditor service running at http://localhost:${PORT}`);
});
