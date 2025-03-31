import { parseFilters } from "./parseFilters.js";
import { parseSortOptions } from "./parseSortOptions.js";

export function generateSQL(payload, pagination) {
	const filters = parseFilters(payload.filters);
	const sort = parseSortOptions(payload.sort);

	const { sql: whereSQL, params } = filters.toSQL();
	const whereClause = whereSQL ? `WHERE ${whereSQL}` : "";
	const sortClause = `ORDER BY ${sort.by} ${sort.order}`;

	const dataSQL = [
		"SELECT * FROM puzzles",
		whereClause,
		sortClause,
		`LIMIT ${pagination.limit} OFFSET ${pagination.offset}`,
	].join(" ");

	const countSQL = `SELECT COUNT(*) as total FROM puzzles ${whereClause}`;

	return { dataSQL, countSQL, params };
}
