import { Database } from "../objects/Database.js";
import { parsePagination } from "./parsePagination.js";
import { generateSQL } from "./generateSQL.js";
import { aggregateThemes } from "./aggregateThemes.js";

export function databaseSearch(payload) {
	const pagination = parsePagination(payload.pagination);
	const { dataSQL, countSQL, params } = generateSQL(payload, pagination);

	const database = new Database("puzzfinder.db");
	database.dataSQL = dataSQL;
	database.countSQL = countSQL;
	database.params = params;

	const { data, count: total } = database.search();

	return {
		data: data.map(aggregateThemes),
		pagination: {
			total,
			page: pagination.page,
			limit: pagination.limit,
			totalPages: Math.ceil(total / pagination.limit),
		},
	};
}
