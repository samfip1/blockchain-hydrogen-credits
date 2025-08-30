import { Router } from "express";
import { PrismaClient } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import { generateProductionSummary, type ProductionSummary } from "./Production_Data.js";

const prisma = new PrismaClient();
const router = Router();

router.post("/claim", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded: any = jwt.verify(token, process.env.SECRET_KEY || "your-secret-key");
    const companyId = decoded.companyId;

    const plants = await prisma.plant.findMany({ where: { companyId } });
    if (!plants.length) return res.status(400).json({ error: "No plants found" });

    const summaries: ProductionSummary[] = plants.map((plant) =>
      generateProductionSummary(companyId, plant.id, plant.stateName)
    );

    const createdClaims = [];
    for (const summary of summaries) {
      const claim = await prisma.claim.create({
        data: {
          companyId: summary.companyId,
          plantId: summary.plantId,
        milestone: summary.milestone,
          subsidyType: "OPEX",
          productionFrom: new Date(),
          productionTo: new Date(),
          hydrogenProduced: summary.hydrogenProduced,
          energyConsumed: summary.energyConsumed,
          status: "PENDING",
          energySource: "HYDRO"
        },
      });
      createdClaims.push(claim);
    }

    const auditorApiUrl = process.env.AUDITOR_API_URL || "http://localhost:4000/submit";
    const response = await axios.post(
      auditorApiUrl,
      { data: summaries },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AUDITOR_API_KEY || ""}`,
        },
      }
    );

    res.status(200).json({
      message: "Production summary submitted successfully",
      auditorResponse: response.data,
      claimsCreated: createdClaims.length,
    });
  } catch (err: any) {
    console.error("Claim submission error:", err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});

export default router;
