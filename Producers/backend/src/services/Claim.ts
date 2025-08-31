import express, { Router, type Request, type Response } from "express";
import { PrismaClient, type Prisma } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import axios from "axios";

const prisma = new PrismaClient();
const router = Router();

interface DailyLog {
    date: string;
    hydrogenProduced: number;
    energyConsumed: number;
}

interface ProductionSummary {
    companyId: string;
    plantId: string;
    milestone: string;
    hydrogenProduced: number;
    energyConsumed: number;
    dailyLogs: DailyLog[];
}

interface LoginRequestBody {
    email: string;
    password: string;
    plant_id_input: string
}

const STATE_FACTORS: Record<string, number> = {
    Delhi: 1.0,
    Maharashtra: 0.95,
    Assam: 0.8,
    Gujarat: 0.9,
    Karnataka: 0.92,
    default: 0.85,
};

const cache: Map<string, ProductionSummary> = new Map();

function generateDay(factor: number, date: Date): DailyLog {
    const hydrogenProduced = (Math.random() * (20000 - 10000) + 10000) * factor;
    const energyConsumed = hydrogenProduced * (Math.random() * (45 - 35) + 35) * factor;

    return {
        date: date.toISOString().split("T")[0] ?? "",
        hydrogenProduced: parseFloat(hydrogenProduced.toFixed(2)),
        energyConsumed: parseFloat(energyConsumed.toFixed(2)),
    };
}

function getOrUpdateProductionSummary(companyId: string, plantId: string, stateName: string): ProductionSummary {
    const key = `${companyId}-${plantId}`;
    const normalizedState = stateName.charAt(0).toUpperCase() + stateName.slice(1).toLowerCase();
    const factor = STATE_FACTORS[normalizedState] ?? 0.85;

    const today = new Date();
    let summary = cache.get(key);

    if (!summary) {
        const dailyLogs: DailyLog[] = [];
        for (let i = 364; i >= 0; i--) {
            const day = new Date(today);
            day.setDate(today.getDate() - i);
            dailyLogs.push(generateDay(factor, day));
        }

        summary = {
            companyId,
            plantId,
            milestone: Date.now().toString(),
            hydrogenProduced: dailyLogs.reduce((a, b) => a + b.hydrogenProduced, 0),
            energyConsumed: dailyLogs.reduce((a, b) => a + b.energyConsumed, 0),
            dailyLogs,
        };

        cache.set(key, summary);
    } else {
        const lastLog = summary.dailyLogs[summary.dailyLogs.length - 1];
        if (!lastLog || lastLog.date !== today.toISOString().split("T")[0]) {
            summary.dailyLogs.shift();
            summary.dailyLogs.push(generateDay(factor, today));

            summary.hydrogenProduced = parseFloat(summary.dailyLogs.reduce((a, b) => a + b.hydrogenProduced, 0).toFixed(2));
            summary.energyConsumed = parseFloat(summary.dailyLogs.reduce((a, b) => a + b.energyConsumed, 0).toFixed(2));
        }
    }

    return summary;
}

router.post("/claim", async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    try {
        const { email, password, plant_id_input } = req.body;

        // 1️⃣ Validate company login
        const company = await prisma.company.findUnique({ where: { email } });
        if (!company || !bcrypt.compareSync(password, company.password)) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 2️⃣ Validate plant_id_input
        if (!plant_id_input) {
            return res.status(400).json({ error: "No plant id found" });
        }

        const plant = await prisma.plant.findUnique({ where: { id: plant_id_input } });
        if (!plant) {
            return res.status(400).json({ error: "No plant found with this plant id" });
        }

        // Ensure plant belongs to the company
        if (plant.companyId !== company.id) {
            return res.status(403).json({ error: "You do not have access to this plant" });
        }

        // 3️⃣ Check yearly claim lock
        const currentYear = new Date().getFullYear();
        const claimExists = await prisma.claimYearLock.findFirst({
            where: {
                plantId: plant.id,
                year: currentYear,
                subsidyType: "OPEX",
            },
        });

        if (claimExists) {
            return res.status(400).json({
                error: `Claim for this plant and subsidy type has already been submitted this year (${currentYear})`,
            });
        }

        // 4️⃣ Generate JWT token
        const token = jwt.sign(
            { companyId: company.id },
            process.env.SECRET_KEY || "your-secret-key",
            { expiresIn: "1d" }
        );

        // 5️⃣ Generate or update production summary & create claim
        const summary = getOrUpdateProductionSummary(company.id, plant.id, plant.stateName);
        const claimId = uuidv4();

        const claim = await prisma.claim.upsert({
            where: { id: claimId },
            update: {
                hydrogenProduced: summary.hydrogenProduced,
                energyConsumed: summary.energyConsumed,
                iotLogs: summary.dailyLogs as unknown as Prisma.InputJsonValue,
                productionTo: new Date(),
            },
            create: {
                id: claimId,
                companyId: summary.companyId,
                plantId: summary.plantId,
                milestone: Math.floor(Date.now() / 1000),
                subsidyType: "OPEX",
                productionFrom: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
                productionTo: new Date(),
                hydrogenProduced: summary.hydrogenProduced,
                energySource: "HYDRO",
                energyConsumed: summary.energyConsumed,
                iotLogs: summary.dailyLogs as unknown as Prisma.InputJsonValue,
                status: "PENDING",
            },
        });

        await prisma.claimYearLock.create({
            data: {
                plantId: plant.id,
                year: currentYear,
                subsidyType: "OPEX",
            },
        });

        res.cookie("token", token, { httpOnly: true });

        // 6️⃣ Send claim to external evaluator immediately
        try {
            const evaluatorUrl = "http://localhost:4000/evaluate"; // Mock auditor endpoint

            const response = await axios.post(evaluatorUrl, {
                claimId: claim.id,
                companyId: company.id,
                plantId: plant.id,
                hydrogenProduced: summary.hydrogenProduced,
                energyConsumed: summary.energyConsumed,
                iotLogs: summary.dailyLogs,
            });

            const result = response.data; // { approved: boolean, subsidyAmount: number, remarks?: string }

            if (typeof result.approved === "boolean" && typeof result.subsidyAmount === "number") {
                // Save ClaimHistory
                await prisma.claimHistory.create({
                    data: {
                        claimId: claim.id,
                        stage: "AUDITOR_VERIFIED",
                        decision: result.approved,
                        remarks: result.remarks || (result.approved ? "Approved" : "Rejected"),
                    },
                });

                // Update claim status
                await prisma.claim.update({
                    where: { id: claim.id },
                    data: { status: result.approved ? "APPROVED" : "REJECTED" },
                });

                // If approved, create payout
                if (result.approved) {
                    const account = await prisma.account.findFirst({ where: { companyId: company.id } });
                    if (account) {
                        await prisma.payout.create({
                            data: {
                                claimId: claim.id,
                                amount: result.subsidyAmount,
                                accountId: account.id,
                            },
                        });

                        await prisma.claimHistory.create({
                            data: {
                                claimId: claim.id,
                                stage: "SUBSIDY_RELEASED",
                                decision: true,
                                remarks: `Subsidy of ${result.subsidyAmount} released`,
                            },
                        });
                    }
                }
            }
        } catch (err) {
            console.error("Error sending claim to external evaluator:", err);
        }

        // 7️⃣ Return response
        res.status(200).json({
            message: "Login successful, production claim created and sent for evaluation",
            token,
            claim,
        });

    } catch (err: any) {
        console.error("Claim error:", err);
        res.status(500).json({ error: "Something went wrong", details: err.message });
    }
});

export default router;
