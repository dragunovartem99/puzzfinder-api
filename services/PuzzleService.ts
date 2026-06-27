import { createHash } from "node:crypto";

import { getCache, setCache } from "../config/cache.ts";
import type { Puzzle, PaginatedPuzzles } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";
import { PuzzleRepository } from "../repositories/PuzzleRepository.ts";

export class PuzzleService {
	#repository: PuzzleRepository;

	constructor(repository: PuzzleRepository) {
		this.#repository = repository;
	}

	async searchPuzzles(options: PuzzleSearchOptions): Promise<PaginatedPuzzles> {
		const key = createHash("sha256").update(JSON.stringify(options)).digest("hex");

		const cached = await getCache<PaginatedPuzzles>(key);
		if (cached) return cached;

		const result = await this.#repository.searchPuzzles(options);
		await setCache(key, result);
		return result;
	}

	getPuzzleById(id: string): Promise<Puzzle | null> {
		return this.#repository.getPuzzleById(id);
	}
}
