import type { FastifyReply, FastifyRequest } from "fastify";

import { NotFoundError } from "../errors/NotFoundError.ts";
import type { Puzzles } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";
import type { PuzzleService } from "../services/PuzzleService.ts";

// Puzzles only change when the DB is rebuilt (at most daily).
const PUZZLE_CACHE_CONTROL = "public, max-age=86400";

export class PuzzleController {
	#puzzleService: PuzzleService;

	constructor(puzzleService: PuzzleService) {
		this.#puzzleService = puzzleService;
	}

	searchPuzzles(req: FastifyRequest<{ Body: PuzzleSearchOptions }>) {
		return this.#puzzleService.searchPuzzles(req.body);
	}

	async getPuzzlesByIds(
		req: FastifyRequest<{ Querystring: { ids: string } }>,
		reply: FastifyReply
	): Promise<Puzzles> {
		const data = await this.#puzzleService.getPuzzlesByIds(req.query.ids.split(","));
		reply.header("cache-control", PUZZLE_CACHE_CONTROL);
		return { data };
	}

	async getPuzzleById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
		const puzzle = await this.#puzzleService.getPuzzleById(req.params.id);
		if (!puzzle) throw new NotFoundError(`Puzzle ${req.params.id} not found`);
		reply.header("cache-control", PUZZLE_CACHE_CONTROL);
		return puzzle;
	}
}
