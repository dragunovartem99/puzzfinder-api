export function parseSortOptions(sort) {
	const validColumns = ["puzzleId", "movesNumber", "rating", "popularity", "nbPlays"];
	const validOrders = ["asc", "desc"];

	const sortBy = validColumns.includes(sort.field) ? sort.field : "puzzleId";
	const sortOrder = validOrders.includes(sort.order) ? sort.order : "asc";

	return { by: sortBy, order: sortOrder };
}
