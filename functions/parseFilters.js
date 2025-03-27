import { Filter } from "../objects/Filter.js";
import { FilterGroup } from "../objects/FilterGroup.js";

export function parseFilters(query) {
	const group = new FilterGroup("AND");

	if (query.rating) {
		group.addFilter(new Filter("rating", "=", query.rating));
	} else {
		query.minRating && group.addFilter(new Filter("rating", ">=", query.minRating));
		query.maxRating && group.addFilter(new Filter("rating", "<=", query.maxRating));
	}

	return group;
}
