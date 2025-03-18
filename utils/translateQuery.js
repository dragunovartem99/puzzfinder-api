export function translateQuery(query) {
	return {
		rating: { $gt: query.minRating },
	};
}
