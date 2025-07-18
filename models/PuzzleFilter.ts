export interface PuzzleFilter {
	themes?: string[];
	minRating?: number;
	maxRating?: number;
	popularityThreshold?: number;
}

export interface PuzzleSort {
	field: "rating" | "popularity" | "ratingDeviation";
	order: "asc" | "desc";
}

export interface PuzzleSearchOptions {
	filter?: PuzzleFilter;
	sort?: PuzzleSort;
	page?: number;
	pageSize?: number;
}
