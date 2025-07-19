import knex, { type Knex } from "knex";
import db from "../config/database.ts";

import type { Puzzle, PaginatedPuzzles } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";

export class PuzzleRepository {
	private knex: Knex;

	constructor() {
		this.knex = knex({
			client: "better-sqlite3",
			connection: { filename: "./db/puzzfinder.db" },
			useNullAsDefault: true,
		});
	}

	public async searchPuzzles(options: PuzzleSearchOptions): Promise<PaginatedPuzzles> {
		const query: Knex.QueryBuilder = this.knex<Puzzle>("puzzles").select("*");

		if (options.filters) {
			this.applyFilters(query, options.filters);
		}

		// Pagination logic remains the same
		const page = options.pagination?.page || 1;
		const limit = options.pagination?.limit || 10;
		const offset = (page - 1) * limit;

		const [puzzles, totalResult] = await Promise.all([
			query.clone().limit(limit).offset(offset),
			query.clone().count("* as total").first(),
		]);

		const total = Number(totalResult?.total) || 0;

		return {
			data: puzzles,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		};
	}

	public async getPuzzleById(id: string): Promise<Puzzle | null> {
		return await this.knex("puzzles").where("puzzleId", id).first();
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
