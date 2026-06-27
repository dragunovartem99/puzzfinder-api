import { createHash } from "node:crypto";

import { getCacheConnection } from "../config/cache.ts";

export class Cache {
	static generateKey(data: unknown): string {
		return createHash("sha256").update(JSON.stringify(data)).digest("hex");
	}

	async init() {
		const conn = await getCacheConnection();
		await conn.run(
			"CREATE TABLE IF NOT EXISTS search_cache (cache_key VARCHAR PRIMARY KEY, data VARCHAR NOT NULL)"
		);
	}

	async get<T>(key: string): Promise<T | null> {
		const conn = await getCacheConnection();
		const result = await conn.runAndReadAll(
			"SELECT data FROM search_cache WHERE cache_key = ?",
			[key]
		);
		const row = (result.getRowObjects() as { data: string }[])[0];
		return row ? (JSON.parse(row.data) as T) : null;
	}

	async set<T>(key: string, data: T): Promise<void> {
		const conn = await getCacheConnection();
		await conn.run("INSERT INTO search_cache (cache_key, data) VALUES (?, ?)", [
			key,
			JSON.stringify(data),
		]);
	}
}
