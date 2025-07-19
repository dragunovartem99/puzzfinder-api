import express from "express";
import puzzleRoutes from "./routes/puzzleRoutes.ts";
import { errorHandler } from "./middleware/errorHandler.ts";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", puzzleRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
