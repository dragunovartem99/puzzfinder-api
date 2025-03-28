import { Filter } from "../objects/Filter.js";
import { Filters } from "../objects/Filters.js";

export function parseFilters(query) {
	const filters = new Filters("AND");

	if (query.rating) {
		filters.addFilter(new Filter("rating", "=", query.rating));
	} else {
		query.ratingMin && filters.addFilter(new Filter("rating", ">=", query.ratingMin));
		query.ratingMax && filters.addFilter(new Filter("rating", "<=", query.ratingMax));
	}

	return filters;
}
