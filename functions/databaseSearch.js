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
		data: puzzles.map((puzzle) => {
			const themes = Object.keys(puzzle)
				.filter((key) => key.startsWith("theme_") && puzzle[key] === 1)
				.map((key) => key.slice(6));

			const rest = Object.fromEntries(
				Object.entries(puzzle).filter(([key]) => !key.startsWith("theme_"))
			);

			return { ...rest, themes };
		}),
		pagination: {
			total,
			page: pagination.page,
			limit: pagination.limit,
			totalPages: Math.ceil(total / pagination.limit),
		},
	};
}
