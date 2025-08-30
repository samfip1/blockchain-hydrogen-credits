import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma/index.js";

interface SigninRequestBody {
    email: string;
    password: string;
}

const prisma = new PrismaClient();
const router = Router();
const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

router.post("/", async (req: Request<{}, {}, SigninRequestBody>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    try {
        const company = await prisma.company.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            },
        });

        if (!company || !bcrypt.compareSync(password, company.password)) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const token = jwt.sign({ companyId: company.id, email: company.email }, SECRET_KEY, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000,
            sameSite: "strict",
        });

        res.status(200).json({
            message: "Successfully logged in!",
            company: {
                id: company.id,
                name: company.name,
                email: company.email,
            },
        });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
});


router.post("/logout", (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({ message: "Successfully logged out." });
});


router.get("/profile", async (req: Request, res: Response) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized." });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { companyId: string; email: string };

        const company = await prisma.company.findUnique({
            where: {
                id: decoded.companyId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                state_name: true,
                city: true,
            },
        });

        if (!company) {
            return res.status(404).json({ error: "Company not found." });
        }

        res.status(200).json({ company });
    } catch (error) {
        console.error("Profile access error:", error);
        res.status(401).json({ error: "Unauthorized or invalid token." });
    }
});

export default router;
