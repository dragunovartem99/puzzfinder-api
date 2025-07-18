import { PuzzleRepository } from "../repositories/PuzzleRepository.ts";
import type { Puzzle, PaginatedPuzzles } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";

export class PuzzleService {
	constructor(private puzzleRepository: PuzzleRepository) {}

	searchPuzzles(options: PuzzleSearchOptions): PaginatedPuzzles {
		// Validate options here if needed
		return this.puzzleRepository.searchPuzzles(options);
	}

	getPuzzleById(id: string): Puzzle | null {
		return this.puzzleRepository.getPuzzleById(id);
	}
}
