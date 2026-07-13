import { Cache } from "../cache/index.ts";
import type { Puzzle, PaginatedPuzzles } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";
import { PuzzleRepository } from "../repositories/PuzzleRepository.ts";

export class PuzzleService {
	#repository: PuzzleRepository;
	#cache: Cache;

	constructor(repository: PuzzleRepository, cache: Cache) {
		this.#repository = repository;
		this.#cache = cache;
	}

	async searchPuzzles(options: PuzzleSearchOptions): Promise<PaginatedPuzzles> {
		const key = Cache.generateKey(options);
		const cached = await this.#cache.get<PaginatedPuzzles>(key);
		if (cached) return cached;

		const result = await this.#repository.searchPuzzles(options);
		await this.#cache.set(key, result);
		return result;
	}

	getPuzzleById(id: string): Promise<Puzzle | null> {
		return this.#repository.getPuzzleById(id);
	}
}
