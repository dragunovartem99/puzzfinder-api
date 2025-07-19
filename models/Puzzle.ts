export interface Puzzle {
	puzzleId: string;
	fen: string;
	moves: string;

	movesNumber: number;
	rating: number;
	ratingDeviation: number;
	popularity: number;
	nbPlays: number;

	gameUrl: string;
	openingTags: string;
}

export interface PaginatedPuzzles {
	data: Puzzle[];
	total: number;
	page: number;
	pageSize: number;
}
