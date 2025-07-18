import db from "../config/database.ts";

import type { Puzzle, PaginatedPuzzles } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";

export class PuzzleRepository {
	searchPuzzles(options: PuzzleSearchOptions): PaginatedPuzzles {
		const {
			filter = {},
			sort = { field: "rating", order: "desc" },
			page = 1,
			pageSize = 20,
		} = options;

		// Base query
		let query = "SELECT * FROM puzzles WHERE 1=1";
		const params: any[] = [];

		// Apply filters
		if (filter.themes && filter.themes.length > 0) {
			query += " AND (";
			filter.themes.forEach((theme, i) => {
				query += ` themes LIKE ? ${i < filter.themes!.length - 1 ? "OR" : ""}`;
				params.push(`%"${theme}"%`);
			});
			query += ")";
		}

		if (filter.minRating) {
			query += " AND rating >= ?";
			params.push(filter.minRating);
		}

		if (filter.maxRating) {
			query += " AND rating <= ?";
			params.push(filter.maxRating);
		}

		if (filter.popularityThreshold) {
			query += " AND popularity >= ?";
			params.push(filter.popularityThreshold);
		}

		// Apply sorting
		query += ` ORDER BY ${sort.field} ${sort.order}`;

		// Count total results (for pagination)
		const countQuery = query.replace("SELECT *", "SELECT COUNT(*) as total");
		const { total } = db.prepare(countQuery).get(...params) as { total: number };

		// Apply pagination
		query += " LIMIT ? OFFSET ?";
		params.push(pageSize, (page - 1) * pageSize);

		// Execute query
		const data = db.prepare(query).all(...params) as Puzzle[];

		return {
			data,
			total,
			page,
			pageSize,
		};
	}

	getPuzzleById(id: string): Puzzle | null {
		const stmt = db.prepare("SELECT * FROM puzzles WHERE puzzleId = ?");
		return stmt.get(id) as Puzzle | null;
	}
}
