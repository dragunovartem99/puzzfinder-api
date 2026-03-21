import type { PuzzleTheme } from "./Theme.ts";

export type BasePuzzle = {
	puzzleId: string;
	fen: string;
	moves: string;
	movesNumber: number;
	rating: number;
	ratingDeviation: number;
	popularity: number;
	nbPlays: number;
	gameUrl: string;
	openingTags?: string;
};

export type DatabasePuzzle = BasePuzzle & {
	theme_bits_a: number;
	theme_bits_b: number;
};

export type Puzzle = BasePuzzle & { themes: PuzzleTheme[] };

export type PaginatedPuzzles = {
	data: Puzzle[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
};
