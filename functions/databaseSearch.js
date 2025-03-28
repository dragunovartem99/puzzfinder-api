import { database } from "../components/database.js";
import { parseFilters } from "./parseFilters.js";
import { getPagination } from "./getPagination.js";

export function databaseSearch(query) {
	const filters = parseFilters(query);

	const { sql: whereSql, params } = filters.toSQL();
	const whereClause = whereSql ? `WHERE ${whereSql}` : "";

	const pagination = getPagination(query);

	const dataSql = [
		"SELECT * FROM puzzles",
		whereClause,
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
