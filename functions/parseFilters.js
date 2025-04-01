import { Filter } from "../objects/Filter.js";
import { FilterGroup } from "../objects/FilterGroup.js";

function parseRangeFilter({ group, filters, name }) {
	if (!filters[name]) {
		return;
	} else if (filters[name].equals) {
		group.addFilter(new Filter(name, "=", filters[name].equals));
	} else {
		filters[name].min && group.addFilter(new Filter(name, ">=", filters[name].min));
		filters[name].max && group.addFilter(new Filter(name, "<=", filters[name].max));
	}
}

export function parseFilters(filters) {
	const group = new FilterGroup("AND");

	parseRangeFilter({ group, filters, name: "rating" });
	parseRangeFilter({ group, filters, name: "popularity" });
	parseRangeFilter({ group, filters, name: "nbPlays" });
	parseRangeFilter({ group, filters, name: "movesNumber" });

	filters.themes?.forEach((theme) => group.addFilter(new Filter(`theme_${theme}`, "=", 1)));

	return group;
}
