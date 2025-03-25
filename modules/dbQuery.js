export function toDbQuery(query) {
	const dbQuery = {
		Rating: {},
	};

	query.minRating && (dbQuery.Rating["$gte"] = parseInt(query.minRating));
	query.maxRating && (dbQuery.Rating["$lte"] = parseInt(query.maxRating));

	return dbQuery;
}
