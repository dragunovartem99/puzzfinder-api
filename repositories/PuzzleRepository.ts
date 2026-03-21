import type { Knex } from "knex";
import type { Puzzle, PaginatedPuzzles, DatabasePuzzle, BasePuzzle } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions, SortField } from "../models/PuzzleFilter.ts";
import type { PuzzleTheme } from "../models/Theme.ts";

import { queryBuilder } from "../config/database.ts";
import { paginateQuery } from "../utils/pagination.ts";
import { THEME_ORDER } from "../constants/theme-order.ts";

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

		if (filters.themes?.length) {
			let maskA = 0n;
			let maskB = 0n;

			for (const theme of filters.themes) {
				const index = THEME_ORDER.indexOf(theme as typeof THEME_ORDER[number]);
				if (index === -1) continue;
				if (index < 63) maskA |= 1n << BigInt(index);
				else maskB |= 1n << BigInt(index - 63);
			}

			if (maskA) query.whereRaw('(theme_bits_a & ?) = ?', [maskA, maskA]);
			if (maskB) query.whereRaw('(theme_bits_b & ?) = ?', [maskB, maskB]);
		}

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
		const bitsA = BigInt(puzzle.theme_bits_a);
		const bitsB = BigInt(puzzle.theme_bits_b);

		const themes: PuzzleTheme[] = [
			...THEME_ORDER.slice(0, 63).filter((_, i) => (bitsA >> BigInt(i)) & 1n),
			...THEME_ORDER.slice(63).filter((_, i) => (bitsB >> BigInt(i)) & 1n),
		];

		const { theme_bits_a, theme_bits_b, ...basePuzzle } = puzzle;

		return { ...basePuzzle, themes };
	}
}
