import type { Puzzle, DatabasePuzzle, PaginatedPuzzles } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions, SortField } from "../models/PuzzleFilter.ts";

import { getConnection } from "../config/database.ts";
import { paginateQuery } from "../utils/pagination.ts";
import { decodeThemes, encodeThemes } from "../utils/themes.ts";

function toPublic({ theme_mask, ...rest }: DatabasePuzzle): Puzzle {
	return { ...rest, themes: decodeThemes(theme_mask) };
}

export class PuzzleRepository {
	public async searchPuzzles(options: PuzzleSearchOptions): Promise<PaginatedPuzzles> {
		const conn = await getConnection();
		const { sql, params } = this.buildQuery(options);
		const result = await paginateQuery<DatabasePuzzle>(conn, sql, params, options.pagination);
		return { ...result, data: result.data.map(toPublic) };
	}

	public async getPuzzleById(id: string): Promise<Puzzle | null> {
		const conn = await getConnection();
		const result = await conn.runAndReadAll(
			"SELECT * FROM puzzles WHERE puzzleId = ?",
			[id]
		);
		const rows = result.getRowObjects() as DatabasePuzzle[];
		return rows[0] ? toPublic(rows[0]) : null;
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
			const mask = encodeThemes(options.filters.themes);
			if (mask !== 0n) {
				conditions.push(`(theme_mask & ${mask}::HUGEINT) = ${mask}::HUGEINT`);
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
