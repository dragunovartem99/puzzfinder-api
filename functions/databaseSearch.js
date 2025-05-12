import { database } from "../components/database.js";

import { Search } from "../objects/Search.js";
import { parsePagination } from "./parsePagination.js";
import { generateSQL } from "./generateSQL.js";
import { aggregateThemes } from "./aggregateThemes.js";

export function databaseSearch(payload) {
	const { data, count: total } = new Search(database)
		.sql(generateSQL(payload, parsePagination(payload.pagination)))
		.go();

	return {
		data: data.map(aggregateThemes),
		pagination: {
			total,
			page: parsePagination(payload.pagination).page,
			limit: parsePagination(payload.pagination).limit,
			totalPages: Math.ceil(total / parsePagination(payload.pagination).limit),
		},
	};
}
