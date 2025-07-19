import type { Request, Response } from "express";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";

import { PuzzleService } from "../services/PuzzleService.ts";

export class PuzzleController {
	constructor(private puzzleService: PuzzleService) {}

	async searchPuzzles(req: Request, res: Response) {
		try {
			const options: PuzzleSearchOptions = {
				filters: req.body.filters,
				sort: req.body.sort,
				pagination: req.body.pagination,
			};

			const result = await this.puzzleService.searchPuzzles(options);
			res.json(result);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getPuzzleById(req: Request, res: Response) {
		try {
			const puzzle = await this.puzzleService.getPuzzleById(req.params.id);
			if (!puzzle) {
				return res.status(404).json({ error: "Puzzle not found" });
			}
			res.json(puzzle);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
}
