import express from "express";
import cors from "cors";
import { httpLogger } from "./utils/logger.js";
import health from "./routes/health.js";
import projects from "./routes/projects.js";
import sensor from "./routes/sensor.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(httpLogger);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Subsidy Backend is running!");
});


// API routes
app.use("/api", health);
app.use("/api/projects", projects);
app.use("/api/sensor", sensor);

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
