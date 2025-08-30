import { Router, type Request, type Response } from "express";
import { PrismaClient } from "../generated/prisma/index.js";
import authMiddleware from "../middleware/authMiddleware.js";

interface AddPlantRequest extends Request {
    companyId?: string;
    body: {
        name: string;
        stateName: string;
        city: string;
    };
}

const prisma = new PrismaClient();
const router = Router();

router.post("/", authMiddleware, async (req: AddPlantRequest, res: Response) => {
    const { name, stateName, city } = req.body;
    const companyId = req.companyId;

    if (!companyId || !name || !stateName || !city) {
        return res.status(400).json({
            message: "Not all required fields are provided (name, stateName, city).",
        });
    }

    try {
        const existingPlant = await prisma.plant.findFirst({
            where: {
                name: name,
                companyId: companyId,
            },
        });

        if (existingPlant) {
            return res.status(409).json({
                message: "A plant with this name already exists for your company.",
            });
        }

        const newPlant = await prisma.plant.create({
            data: {
                companyId: companyId,
                name: name,
                stateName: stateName,
                city: city,
            },
        });

        return res.status(201).json({
            message: "Plant added successfully!",
            plant: newPlant,
        });
    } catch (error) {
        console.error("Error adding plant:", error);
        return res.status(500).json({
            message: "Something went wrong. Please try again later.",
        });
    }
});

export default router;
