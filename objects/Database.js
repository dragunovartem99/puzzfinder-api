import API from "better-sqlite3";

export class Database {
	#api;
	#params = [];
	#dataSQL;
	#countSQL;

	constructor(path) {
		this.#api = new API(path);
		this.#api.pragma("journal_mode = WAL");
	}

	set dataSQL(sql) {
		this.#dataSQL = sql;
	}

	set countSQL(sql) {
		this.#countSQL = sql;
	}

	set params(params) {
		this.#params.push(...params);
	}

	search() {
		let data, count;

		if (this.#dataSQL) {
			const stmt = this.#api.prepare(this.#dataSQL);
			data = this.#params.length ? stmt.all(...this.#params) : stmt.all();
		}

		if (this.#countSQL) {
			const stmt = this.#api.prepare(this.#countSQL);
			({ count } = this.#params.length ? stmt.get(...this.#params) : stmt.get());
		}

		return { data, count };
	}
}
