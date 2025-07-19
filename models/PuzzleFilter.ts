import type { BasePuzzle } from "./Puzzle.ts";

type SortOrder = "asc" | "desc";

export type SortField = Extract<
	keyof BasePuzzle,
	"rating" | "movesNumber" | "popularity" | "nbPlays" | "puzzleId"
>;

type RangeFilter = Exclude<SortField, "puzzleId">;

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
		field: SortField;
		order: SortOrder;
	};
	pagination: {
		page: number;
		limit: number;
	};
};
