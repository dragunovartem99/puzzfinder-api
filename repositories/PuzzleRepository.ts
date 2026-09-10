import type { DuckDBInstance, DuckDBValue } from "@duckdb/node-api";

import { withConnection } from "../config/database.ts";
import type { Puzzle, DatabasePuzzle } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";
import { componentEnum } from "../schemas/openapi.ts";
import { decodeThemes, encodeThemes } from "../utils/themes.ts";

// The contract is the single source of truth for sortable fields.
const SORT_FIELDS = componentEnum("SortField");

// A search compiled to SQL fragments. Equivalent searches compile to the same
// fragments, which makes them usable as cache keys.
export type CompiledSearch = {
	where: string;
	params: DuckDBValue[];
	orderBy: string;
};

function toPublic({ theme_mask, ...rest }: DatabasePuzzle): Puzzle {
	return { ...rest, themes: decodeThemes(theme_mask) };
}

export class PuzzleRepository {
	#db: DuckDBInstance;

	constructor(db: DuckDBInstance) {
		this.#db = db;
	}

	public compile(options: Pick<PuzzleSearchOptions, "filters" | "sort">): CompiledSearch {
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

		// puzzleId breaks ties so pages never overlap or skip rows; without an
		// ORDER BY DuckDB returns rows in a nondeterministic order.
		const sort = options.sort;
		let orderBy = "ORDER BY puzzleId";
		if (sort && SORT_FIELDS.includes(sort.field)) {
			const direction = sort.order === "desc" ? "DESC" : "ASC";
			orderBy =
				sort.field === "puzzleId"
					? `ORDER BY puzzleId ${direction}`
					: `ORDER BY ${sort.field} ${direction}, puzzleId`;
		}

		return { where, params, orderBy };
	}

	public countPuzzles({ where, params }: CompiledSearch): Promise<number> {
		return withConnection(this.#db, async (conn) => {
			const result = await conn.runAndReadAll(
				`SELECT COUNT(*) AS total FROM puzzles ${where}`,
				params
			);
			return Number((result.getRowObjects()[0] as { total: bigint }).total);
		});
	}

	public findPuzzles(
		{ where, params, orderBy }: CompiledSearch,
		limit: number,
		offset: number
	): Promise<Puzzle[]> {
		return withConnection(this.#db, async (conn) => {
			const result = await conn.runAndReadAll(
				`SELECT * FROM puzzles ${where} ${orderBy} LIMIT ? OFFSET ?`,
				[...params, limit, offset]
			);
			return (result.getRowObjects() as DatabasePuzzle[]).map((row) => toPublic(row));
		});
	}

	public getPuzzleById(id: string): Promise<Puzzle | null> {
		return withConnection(this.#db, async (conn) => {
			const result = await conn.runAndReadAll("SELECT * FROM puzzles WHERE puzzleId = ?", [
				id,
			]);
			const rows = result.getRowObjects() as DatabasePuzzle[];
			return rows[0] ? toPublic(rows[0]) : null;
		});
	}
}
