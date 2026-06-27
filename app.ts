import cors from "cors";
import express from "express";

import puzzleRoutes from "./routes/puzzleRoutes.ts";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api", puzzleRoutes);

export default app;
