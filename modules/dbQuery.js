export function toDbQuery(query) {
	const dbQuery = { 
		Rating: {}
	};

	query.minRating && (dbQuery.Rating["$gte"] = query.minRating);
	query.maxRating && (dbQuery.Rating["$lte"] = query.maxRating);

	return dbQuery;
}
