import type { DuckDBConnection, DuckDBValue } from "@duckdb/node-api";

import type { Puzzle, DatabasePuzzle, PaginatedPuzzles } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";
import { componentEnum } from "../schemas/openapi.ts";
import { paginateQuery } from "../utils/pagination.ts";
import { decodeThemes, encodeThemes } from "../utils/themes.ts";

// The contract is the single source of truth for sortable fields.
const SORT_FIELDS = componentEnum("SortField");

function toPublic({ theme_mask, ...rest }: DatabasePuzzle): Puzzle {
	return { ...rest, themes: decodeThemes(theme_mask) };
}

export class PuzzleRepository {
	#conn: DuckDBConnection;

	constructor(conn: DuckDBConnection) {
		this.#conn = conn;
	}

	public async searchPuzzles(options: PuzzleSearchOptions): Promise<PaginatedPuzzles> {
		const { sql, params } = this.buildQuery(options);
		const result = await paginateQuery<DatabasePuzzle>(
			this.#conn,
			sql,
			params,
			options.pagination
		);
		return { ...result, data: result.data.map(toPublic) };
	}

	public async getPuzzleById(id: string): Promise<Puzzle | null> {
		const result = await this.#conn.runAndReadAll("SELECT * FROM puzzles WHERE puzzleId = ?", [
			id,
		]);
		const rows = result.getRowObjects() as DatabasePuzzle[];
		return rows[0] ? toPublic(rows[0]) : null;
	}

	private buildQuery(options: PuzzleSearchOptions): { sql: string; params: DuckDBValue[] } {
		const conditions: string[] = [];
		const params: DuckDBValue[] = [];

		const rangeFilters = ["rating", "movesNumber", "popularity", "nbPlays"] as const;
		for (const key of rangeFilters) {
			const filter = options.filters?.[key];
			if (!filter) continue;
			if (filter.equals === undefined) {
				if (filter.min !== undefined) {
					conditions.push(`${key} >= ?`);
					params.push(filter.min);
				}
				if (filter.max !== undefined) {
					conditions.push(`${key} <= ?`);
					params.push(filter.max);
				}
			} else {
				conditions.push(`${key} = ?`);
				params.push(filter.equals);
			}
		}

		if (options.filters?.themes?.length) {
			const mask = encodeThemes(options.filters.themes);
			if (mask !== 0n) {
				conditions.push(`(theme_mask & ${mask}::HUGEINT) = ${mask}::HUGEINT`);
			}
		}

		const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

		const sort = options.sort;
		const orderBy =
			sort?.field && SORT_FIELDS.includes(sort.field)
				? `ORDER BY ${sort.field} ${sort.order === "desc" ? "DESC" : "ASC"}`
				: "";

		return { sql: `SELECT * FROM puzzles ${where} ${orderBy}`, params };
	}
}
