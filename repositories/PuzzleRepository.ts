import { type Knex } from "knex";
import { queryBuilder } from "../config/database.ts";

import type { Puzzle, PaginatedPuzzles } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";

import { paginateQuery } from "../utils/pagination.ts";

export class PuzzleRepository {
	private queryBuilder: Knex;

	constructor(builder: Knex = queryBuilder) {
		this.queryBuilder = builder;
	}

	public async searchPuzzles(options: PuzzleSearchOptions): Promise<PaginatedPuzzles> {
		const query = this.queryBuilder<Puzzle>("puzzles").select("*");

		if (options.filters) this.applyFilters(query, options.filters);
		if (options.sort) this.applySorting(query, options.sort);

		const { pagination, data } = await paginateQuery<Puzzle>(query, options.pagination);

		return {
			data: data.map((puzzle) => {
				const prefix = "theme_";

				const themes = Object.keys(puzzle)
					.filter((key) => key.startsWith(prefix) && puzzle[key] === 1)
					.map((key) => key.slice(prefix.length));

				const noThemesPuzzle = Object.fromEntries(
					Object.entries(puzzle).filter(([key]) => !key.startsWith(prefix))
				);

				return { ...noThemesPuzzle, themes } as Puzzle;
			}),
			pagination,
		};
	}

	public async getPuzzleById(id: string): Promise<Puzzle | null> {
		return (await this.queryBuilder<Puzzle>("puzzles").where("puzzleId", id).first()) ?? null;
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
		const validSortFields = ["rating", "movesNumber", "popularity", "nbPlays", "puzzleId"];

		if (sort.field && validSortFields.includes(sort.field)) {
			query.orderBy(sort.field, sort.order);
		}

		return query;
	}
}
