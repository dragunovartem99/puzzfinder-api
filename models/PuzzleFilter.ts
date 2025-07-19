type SortOrder = "asc" | "desc";
type RangeFilter = "rating" | "movesNumber" | "popularity" | "nbPlays";

type NumberRange = {
	min: number;
	max: number;
	equals: number;
};

type PuzzleFilters = {
	[Filter in RangeFilter]: Partial<NumberRange>;
} & { themes: string[] };

export type PuzzleSearchOptions = {
	filters: PuzzleFilters;
	sort: {
		field: string;
		order: SortOrder;
	};
	pagination: {
		page: number;
		limit: number;
	};
};
