// src/middleware/auth.ts
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Express Request type to include the companyId
interface AuthRequest extends Request {
  companyId?: string;
}

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Authorization token missing." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { companyId: string };
    req.companyId = decoded.companyId; // Attach companyId to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

export default authMiddleware;