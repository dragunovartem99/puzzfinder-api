export class Filter {
	#field;
	#operator;
	#value;

	constructor(field, operator, value) {
		this.#field = field;
		this.#operator = operator;
		this.#value = value;
	}

	toSQL() {
		return {
			sql: `${this.#field} ${this.#operator} ?`,
			params: [this.#value],
		};
	}
}
