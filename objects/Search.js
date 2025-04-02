import { database } from "../components/database.js";

export class Search {
	#db = database;
	#params = [];
	#dataSQL;
	#countSQL;

	constructor({ dataSQL, countSQL, params }) {
		this.#dataSQL = dataSQL;
		this.#countSQL = countSQL;
		this.#params.push(...params);
	}

	go() {
		let data, count;

		if (this.#dataSQL) {
			const stmt = this.#db.prepare(this.#dataSQL);
			data = this.#params.length ? stmt.all(...this.#params) : stmt.all();
		}

		if (this.#countSQL) {
			const stmt = this.#db.prepare(this.#countSQL);
			({ count } = this.#params.length ? stmt.get(...this.#params) : stmt.get());
		}

		return { data, count };
	}
}
