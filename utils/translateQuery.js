export function translateQuery(query) {
	const dbQuery = { 
		rating: {}
	};

	query.minRating && (dbQuery.rating["$gte"] = query.minRating);
	query.maxRating && (dbQuery.rating["$lte"] = query.maxRating);

	return dbQuery;
}
