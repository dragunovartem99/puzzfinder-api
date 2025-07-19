export type Puzzle = {
	puzzleId: string;
	fen: string;
	moves: string;
	movesNumber: number;
	rating: number;
	ratingDeviation: number;
	popularity: number;
	nbPlays: number;
	themes: string[];
	gameUrl: string;
	openingTags?: string;
};

export type PaginatedPuzzles = {
	data: Puzzle[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
};
