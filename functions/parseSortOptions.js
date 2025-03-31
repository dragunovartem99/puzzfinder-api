export function parseSortOptions(query) {
	const validColumns = ["id", "movesNumber", "rating", "popularity", "nbPlays"];
	const validOrders = ["asc", "desc"];

	const sortBy = validColumns.includes(query.sortBy) ? query.sortBy : "id";
	const sortOrder = validOrders.includes(query.sortOrder) ? query.sortOrder : "asc";

	return {
		by: sortBy,
		order: sortOrder,
	};
}
