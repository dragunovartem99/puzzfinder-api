import { database } from "../components/database.js";
import { parseFilters } from "./parseFilters.js";
import { parseSortOptions } from "./parseSortOptions.js";
import { parsePagination } from "./parsePagination.js";

export function databaseSearch(payload) {
	console.log(payload);
	const filters = parseFilters(payload.filters);
	const pagination = parsePagination(payload.pagination);
	const sort = parseSortOptions("");

	const { sql: whereSql, params } = filters.toSQL();
	const whereClause = whereSql ? `WHERE ${filters.toSQL()}` : "";
	const sortClause = `ORDER BY ${sort.by} ${sort.order}`;

	const dataSql = [
		"SELECT * FROM puzzles",
		whereClause,
		sortClause,
		`LIMIT ${pagination.limit} OFFSET ${pagination.offset}`,
	].join(" ");

	const countSql = `SELECT COUNT(*) as total FROM puzzles ${whereClause}`;

	const statement = database.prepare(dataSql);
	const countStatement = database.prepare(countSql);

	const puzzles = params.length ? statement.all(...params) : statement.all();
	const { total } = params.length ? countStatement.get(...params) : countStatement.get();

	return {
		data: puzzles,
		pagination: {
			total,
			page: pagination.page,
			limit: pagination.limit,
			totalPages: Math.ceil(total / pagination.limit),
		},
	};
}
