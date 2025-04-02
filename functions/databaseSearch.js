import { Search } from "../objects/Search.js";
import { parsePagination } from "./parsePagination.js";
import { generateSQL } from "./generateSQL.js";
import { aggregateThemes } from "./aggregateThemes.js";

export function databaseSearch(payload) {
	const pagination = parsePagination(payload.pagination);
	const search = new Search(generateSQL(payload, pagination));

	const { data, count: total } = search.go();

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
