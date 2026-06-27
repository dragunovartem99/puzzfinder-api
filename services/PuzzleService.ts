import type { Puzzle, PaginatedPuzzles } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";
import { PuzzleRepository } from "../repositories/PuzzleRepository.ts";

export class PuzzleService {
	#repository: PuzzleRepository;

	constructor(repository: PuzzleRepository) {
		this.#repository = repository;
	}

	searchPuzzles(options: PuzzleSearchOptions): Promise<PaginatedPuzzles> {
		return this.#repository.searchPuzzles(options);
	}

	getPuzzleById(id: string): Promise<Puzzle | null> {
		return this.#repository.getPuzzleById(id);
	}
}
