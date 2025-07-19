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
		const query: Knex.QueryBuilder = this.queryBuilder<Puzzle>("puzzles").select("*");

		if (options.filters) {
			this.applyFilters(query, options.filters);
		}

		return paginateQuery<Puzzle>(query, options.pagination);
	}

	public async getPuzzleById(id: string): Promise<Puzzle | null> {
		return (await this.queryBuilder<Puzzle>("puzzles").where("puzzleId", id).first()) ?? null;
	}

	private applyFilters(query: Knex.QueryBuilder, filters: any): Knex.QueryBuilder {
		const rangeFilters = ["rating", "movesNumber", "popularity", "nbPlays"] as const;

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

		return query;
	}
}
