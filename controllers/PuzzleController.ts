import type { Request, Response } from "express";

import { Cache } from "../cache/index.ts";
import type { PaginatedPuzzles } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";
import { PuzzleService } from "../services/PuzzleService.ts";

export class PuzzleController {
	#puzzleService: PuzzleService;
	#cache: Cache;

	constructor(puzzleService: PuzzleService, cache: Cache) {
		this.#puzzleService = puzzleService;
		this.#cache = cache;
	}

	async searchPuzzles(req: Request, res: Response) {
		try {
			const options: PuzzleSearchOptions = {
				filters: req.body.filters,
				sort: req.body.sort,
				pagination: req.body.pagination,
			};

			const key = Cache.generateKey(options);
			const cached = await this.#cache.get<PaginatedPuzzles>(key);
			if (cached) return res.json(cached);

			const result = await this.#puzzleService.searchPuzzles(options);
			await this.#cache.set(key, result);
			res.json(result);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getPuzzleById(req: Request, res: Response) {
		try {
			const puzzle = await this.#puzzleService.getPuzzleById(req.params.id);
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
