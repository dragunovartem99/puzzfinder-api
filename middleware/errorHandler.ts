import type { Request, Response } from "express";

export function errorHandler(err: Error, _: Request, res: Response) {
	console.error(err.stack);
	// res.status(500).json({ error: "Something went wrong!" });
}
