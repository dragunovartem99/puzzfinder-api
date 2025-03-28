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

	if (query.popularity) {
		filters.addFilter(new Filter("popularity", "=", query.popularity));
	} else {
		query.popularityMin && filters.addFilter(new Filter("popularity", ">=", query.popularityMin));
		query.popularityMax && filters.addFilter(new Filter("popularity", "<=", query.popularityMax));
	}

	return filters;
}
