import type { Request, Response } from "express";

import { PuzzleService } from "../services/PuzzleService.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";

export class PuzzleController {
	constructor(private puzzleService: PuzzleService) {}

	async searchPuzzles(req: Request, res: Response) {
		try {
			const options: PuzzleSearchOptions = {
				filter: req.body.filter,
				sort: req.body.sort,
				page: req.body.page,
				pageSize: req.body.pageSize,
			};

			const result = this.puzzleService.searchPuzzles(options);
			res.json(result);
		} catch (error) {
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getPuzzleById(req: Request, res: Response) {
		try {
			const puzzle = this.puzzleService.getPuzzleById(req.params.id);
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
