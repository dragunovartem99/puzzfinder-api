import { database } from "../components/database.js";
import { parsePagination } from "./parsePagination.js";
import { generateSQL } from "./generateSQL.js";

export function databaseSearch(payload) {
	const pagination = parsePagination(payload.pagination);
	const { dataSQL, countSQL, params } = generateSQL(payload, pagination);

	const statement = database.prepare(dataSQL);
	const countStatement = database.prepare(countSQL);

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
