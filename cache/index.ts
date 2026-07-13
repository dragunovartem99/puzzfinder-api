import { createHash } from "node:crypto";

import type { DuckDBConnection } from "@duckdb/node-api";

export class Cache {
	#conn: DuckDBConnection;

	constructor(conn: DuckDBConnection) {
		this.#conn = conn;
	}

	static generateKey(data: unknown): string {
		return createHash("sha256").update(JSON.stringify(data)).digest("hex");
	}

	async init() {
		await this.#conn.run(
			"CREATE TABLE IF NOT EXISTS search_cache (cache_key VARCHAR PRIMARY KEY, data VARCHAR NOT NULL)"
		);
	}

	async get<T>(key: string): Promise<T | null> {
		const result = await this.#conn.runAndReadAll(
			"SELECT data FROM search_cache WHERE cache_key = ?",
			[key]
		);
		const row = (result.getRowObjects() as { data: string }[])[0];
		return row ? (JSON.parse(row.data) as T) : null;
	}

	async set<T>(key: string, data: T): Promise<void> {
		// OR REPLACE keeps concurrent identical searches from violating the primary key.
		await this.#conn.run(
			"INSERT OR REPLACE INTO search_cache (cache_key, data) VALUES (?, ?)",
			[key, JSON.stringify(data)]
		);
	}
}
