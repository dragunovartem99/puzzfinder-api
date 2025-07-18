export interface Puzzle {
	id: string;
	fen: string;
	moves: string;
	rating: number;
	ratingDeviation: number;
	popularity: number;
	themes: string;
	gameUrl: string;
}

export interface PaginatedPuzzles {
	data: Puzzle[];
	total: number;
	page: number;
	pageSize: number;
}
