type NumberRange = { min: number; max: number; equals: number };

type PuzzleFilters = {
	rating: Partial<NumberRange>;
	movesNumber: Partial<NumberRange>;
	popularity: Partial<NumberRange>;
	nbPlays: Partial<NumberRange>;
	themes: string[];
};

export type PuzzleSearchOptions = {
	filters?: PuzzleFilters;
	sort?: {
		field: string;
		order: string;
	};
	pagination?: {
		page: number;
		limit: number;
	};
}
