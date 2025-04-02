import { Filter } from "../objects/Filter.js";
import { FilterGroup } from "../objects/FilterGroup.js";

function parseThemeFilter({ group, filters }) {
	filters.themes?.forEach((theme) => group.addFilter(new Filter(`theme_${theme}`, "=", 1)));
}

function parseRangeFilter({ group, filters, name }) {
	if (!filters[name]) return;

	if (filters[name].equals) {
		group.addFilter(new Filter(name, "=", filters[name].equals));
	} else {
		filters[name].min && group.addFilter(new Filter(name, ">=", filters[name].min));
		filters[name].max && group.addFilter(new Filter(name, "<=", filters[name].max));
	}
}

function parseRangeFilters({ group, filters }) {
	const rangeFilters = ["rating", "popularity", "nbPlays", "movesNumber"];
	rangeFilters.forEach((name) => parseRangeFilter({ group, filters, name }));
}

export function parseFilters(filters) {
	const group = new FilterGroup("AND");

	parseRangeFilters({ group, filters });
	parseThemeFilter({ group, filters });

	return group;
}
