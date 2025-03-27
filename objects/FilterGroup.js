export class FilterGroup {
	#logic;
	#filters = [];

	constructor(logic = "AND", filters = []) {
		this.#logic = logic;
		this.#filters = filters;
	}

	addFilter(filter) {
		this.#filters.push(filter);
		return this;
	}

	toSQL() {
		if (this.#filters.length === 0) return { sql: "", params: [] };
		if (this.#filters.length === 1) return this.#filters[0].toSQL();

		const parts = [];
		const params = [];

		for (const filter of this.#filters) {
			const { sql, params: p } = filter.toSQL();
			parts.push(`(${sql})`);
			params.push(...p);
		}

		return {
			sql: parts.join(` ${this.#logic} `),
			params,
		};
	}
}
