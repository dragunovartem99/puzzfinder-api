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

	// Cached results are only valid for the puzzles DB they were computed from,
	// so a different dbVersion (the DB was rebuilt) drops them.
	async init(dbVersion: string) {
		await this.#conn.run(
			"CREATE TABLE IF NOT EXISTS search_cache (cache_key VARCHAR PRIMARY KEY, data VARCHAR NOT NULL)"
		);
		await this.#conn.run("CREATE TABLE IF NOT EXISTS cache_meta (db_version VARCHAR NOT NULL)");

		const result = await this.#conn.runAndReadAll("SELECT db_version FROM cache_meta");
		const row = (result.getRowObjects() as { db_version: string }[])[0];
		if (row?.db_version === dbVersion) return;

		await this.#conn.run("DELETE FROM search_cache");
		await this.#conn.run("DELETE FROM cache_meta");
		await this.#conn.run("INSERT INTO cache_meta VALUES (?)", [dbVersion]);
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
