import type { FastifyRequest } from "fastify";

import { NotFoundError } from "../errors/NotFoundError.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";
import { PuzzleService } from "../services/PuzzleService.ts";

export class PuzzleController {
	#puzzleService: PuzzleService;

	constructor(puzzleService: PuzzleService) {
		this.#puzzleService = puzzleService;
	}

	searchPuzzles(req: FastifyRequest<{ Body: PuzzleSearchOptions }>) {
		return this.#puzzleService.searchPuzzles(req.body);
	}

	async getPuzzleById(req: FastifyRequest<{ Params: { id: string } }>) {
		const puzzle = await this.#puzzleService.getPuzzleById(req.params.id);
		if (!puzzle) throw new NotFoundError(`Puzzle ${req.params.id} not found`);
		return puzzle;
	}
}
