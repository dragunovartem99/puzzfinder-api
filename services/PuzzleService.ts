import type { Puzzle, PaginatedPuzzles } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";

import { PuzzleRepository } from "../repositories/PuzzleRepository.ts";

export class PuzzleService {
	constructor(private puzzleRepository: PuzzleRepository) {}

	async searchPuzzles(options: PuzzleSearchOptions): Promise<PaginatedPuzzles> {
		return this.puzzleRepository.searchPuzzles(options);
	}

	async getPuzzleById(id: string): Promise<Puzzle | null> {
		return this.puzzleRepository.getPuzzleById(id);
	}
}
