import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma/index.js";

interface SignupRequestBody {
    name: string;
    email: string;
    password: string;
    stateName: string;
    city: string;
    bank: string;
}

const prisma = new PrismaClient();
const router = Router();
const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

const INDIAN_STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

const generateFakeAccountDetails = () => {

    const generateIfscCode = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const bankCode = Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
        const branchCode = Array.from({ length: 6 }, () => numbers[Math.floor(Math.random() * numbers.length)]).join("");
        return `${bankCode}0${branchCode}`;
    };

    const generateAccountNumber = () => Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");

    return {
        accountNumber: generateAccountNumber(),
        ifscCode: generateIfscCode()
        };
};

router.post("/", async (req: Request<{}, {}, SignupRequestBody>, res: Response) => {

    let ans: boolean = true;
    const { name, email, password, stateName, city , bank } = req.body;

    if (!name || !email || !password || !stateName || !city || !bank) {
        return res.status(400).json({ error: "Name, email, password, state, bank and city are required." });
    }

    const bankNames = ["HDFC Bank", "ICICI Bank", "State Bank of India", "Punjab National Bank", "Axis Bank", "Kotak Mahindra Bank", "Bank of Baroda", "Union Bank of India", "Canara Bank", "IndusInd Bank"];

    if (!INDIAN_STATES.includes(stateName)) {
        return res.status(400).json({ error: "Invalid state name. Please provide a valid state from India." });
    }
    if (!bankNames.includes(bank)) {
        return res.status(400).json({ error: "Invalid bank name. Please provide a valid bank from India." });
    }

    try {
        const existingCompany = await prisma.company.findFirst({
            where: { OR: [{ email }, { name }] },
        });

        if (existingCompany) {
            if (existingCompany.email === email) return res.status(409).json({ error: "A company with this email already exists." });
            if (existingCompany.name === name) return res.status(409).json({ error: "A company with this name already exists." });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);
        const fakeBankDetails = generateFakeAccountDetails();
        
        const newCompany = await prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    state_name: stateName,
                    city,
                },
                select: { id: true, name: true, email: true, state_name: true },
            });

            await tx.plant.create({
                data: {
                    name: `${name} - Default Plant`,
                    stateName,
                    city,
                    company: { connect: { id: company.id } },
                },
            });
            await tx.account.create({
                data: {
                    companyId: company.id,
                    accountHolderName: name,
                    bankName:bank.toUpperCase(),
                    accountNumber: fakeBankDetails.accountNumber!,
                    ifscCode: fakeBankDetails.ifscCode!,
                },
            });

            return company;
        }, { timeout: 7000 });
        const token = jwt.sign({ companyId: newCompany.id, email: newCompany.email }, SECRET_KEY, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000,
            sameSite: "strict",
        });

        res.status(201).json({
            message: "Company created successfully!",
            company: {
                id: newCompany.id,
                name: newCompany.name,
                email: newCompany.email,
                state_name: newCompany.state_name,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);

        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
});

export default router;
