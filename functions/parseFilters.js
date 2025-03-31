import { Filter } from "../objects/Filter.js";
import { Filters } from "../objects/Filters.js";

function parseRangeFilter({ query, filters, name }) {
	if (query[name]) {
		filters.addFilter(new Filter(name, "=", query[name]));
	} else {
		query[name + "Min"] && filters.addFilter(new Filter(name, ">=", query[name + "Min"]));
		query[name + "Max"] && filters.addFilter(new Filter(name, "<=", query[name + "Max"]));
	}
}

export function parseFilters(query) {
	const filters = new Filters("AND");

	parseRangeFilter({ query, filters, name: "rating" });
	parseRangeFilter({ query, filters, name: "popularity" });
	parseRangeFilter({ query, filters, name: "nbPlays" });
	parseRangeFilter({ query, filters, name: "movesNumber" });

	return filters;
}
