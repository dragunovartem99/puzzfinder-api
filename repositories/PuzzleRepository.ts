import type { Knex } from "knex";
import type { Puzzle, PaginatedPuzzles, DatabasePuzzle, BasePuzzle } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions, SortField } from "../models/PuzzleFilter.ts";
import type { PuzzleTheme, ThemeKey } from "../models/Theme.ts";

import { queryBuilder } from "../config/database.ts";
import { paginateQuery } from "../utils/pagination.ts";

export class PuzzleRepository {
	private queryBuilder: Knex;

	constructor(builder: Knex = queryBuilder) {
		this.queryBuilder = builder;
	}

	public async searchPuzzles(options: PuzzleSearchOptions): Promise<PaginatedPuzzles> {
		const query = this.queryBuilder<DatabasePuzzle>("puzzles").select("*");

		if (options.filters) this.applyFilters(query, options.filters);
		if (options.sort) this.applySorting(query, options.sort);

		const result = await paginateQuery<DatabasePuzzle>(query, options.pagination);

		return {
			data: result.data.map((puzzle) => this.remapPuzzleThemes(puzzle)),
			pagination: result.pagination,
		};
	}

	public async getPuzzleById(id: string): Promise<Puzzle | null> {
		const found = await this.queryBuilder<DatabasePuzzle>("puzzles")
			.where("puzzleId", id)
			.first();

		return found ? this.remapPuzzleThemes(found) : null;
	}

	private applyFilters(query: Knex.QueryBuilder, filters: PuzzleSearchOptions["filters"]) {
		const rangeFilters = ["rating", "movesNumber", "popularity", "nbPlays"];

		rangeFilters.forEach((key) => {
			const filter = filters[key];

			if (!filter) return;

			if (filter.equals !== undefined) {
				query.where(key, filter.equals);
			} else {
				if (filter.min !== undefined) query.where(key, ">=", filter.min);
				if (filter.max !== undefined) query.where(key, "<=", filter.max);
			}
		});

		filters.themes?.forEach((key) => {
			query.where(`theme_${key}`, "=", 1);
		});

		return query;
	}

	private applySorting(query: Knex.QueryBuilder, sort: PuzzleSearchOptions["sort"]) {
		const validSortFields: SortField[] = [
			"rating",
			"movesNumber",
			"popularity",
			"nbPlays",
			"puzzleId",
		];

		if (sort.field && validSortFields.includes(sort.field)) {
			query.orderBy(sort.field, sort.order);
		}

		return query;
	}

	private remapPuzzleThemes(puzzle: DatabasePuzzle): Puzzle {
		const prefix = "theme_";

		const themes = Object.keys(puzzle)
			.filter((key): key is ThemeKey => key.startsWith(prefix) && puzzle[key] === 1)
			.map((key) => key.slice(prefix.length) as PuzzleTheme);

		const basePuzzle = Object.fromEntries(
			Object.entries(puzzle).filter(([key]) => !key.startsWith(prefix))
		) as BasePuzzle;

		return { ...basePuzzle, themes };
	}
}
