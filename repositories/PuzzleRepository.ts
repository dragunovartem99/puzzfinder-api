import type { Puzzle, PaginatedPuzzles } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions, SortField } from "../models/PuzzleFilter.ts";

import { getConnection } from "../config/database.ts";
import { paginateQuery } from "../utils/pagination.ts";

export class PuzzleRepository {
	public async searchPuzzles(options: PuzzleSearchOptions): Promise<PaginatedPuzzles> {
		const conn = await getConnection();
		const { sql, params } = this.buildQuery(options);
		return paginateQuery<Puzzle>(conn, sql, params, options.pagination);
	}

	public async getPuzzleById(id: string): Promise<Puzzle | null> {
		const conn = await getConnection();
		const result = await conn.runAndReadAll(
			"SELECT * FROM puzzles WHERE puzzleId = ?",
			[id]
		);
		const rows = result.getRowObjects() as Puzzle[];
		return rows[0] ?? null;
	}

	private buildQuery(options: PuzzleSearchOptions): { sql: string; params: unknown[] } {
		const conditions: string[] = [];
		const params: unknown[] = [];

		const rangeFilters = ["rating", "movesNumber", "popularity", "nbPlays"] as const;
		for (const key of rangeFilters) {
			const filter = options.filters?.[key];
			if (!filter) continue;
			if (filter.equals !== undefined) {
				conditions.push(`${key} = ?`);
				params.push(filter.equals);
			} else {
				if (filter.min !== undefined) {
					conditions.push(`${key} >= ?`);
					params.push(filter.min);
				}
				if (filter.max !== undefined) {
					conditions.push(`${key} <= ?`);
					params.push(filter.max);
				}
			}
		}

		if (options.filters?.themes?.length) {
			for (const theme of options.filters.themes) {
				conditions.push("list_contains(themes, ?)");
				params.push(theme);
			}
		}

		const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

		const validSortFields: SortField[] = [
			"rating",
			"movesNumber",
			"popularity",
			"nbPlays",
			"puzzleId",
		];
		const sort = options.sort;
		const orderBy =
			sort?.field && validSortFields.includes(sort.field)
				? `ORDER BY ${sort.field} ${sort.order === "desc" ? "DESC" : "ASC"}`
				: "";

		return { sql: `SELECT * FROM puzzles ${where} ${orderBy}`, params };
	}
}
