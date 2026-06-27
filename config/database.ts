import { DuckDBInstance } from "@duckdb/node-api";

let instance: DuckDBInstance | null = null;
let cacheInstance: DuckDBInstance | null = null;

export async function getConnection() {
	if (!instance) {
		instance = await DuckDBInstance.create("/app/puzzfinder.db");
	}
	return instance.connect();
}

export async function getCacheConnection() {
	if (!cacheInstance) {
		cacheInstance = await DuckDBInstance.create("cache.db");
	}
	return cacheInstance.connect();
}

export async function initCache() {
	const conn = await getCacheConnection();
	await conn.run(
		"CREATE TABLE IF NOT EXISTS search_cache (cache_key VARCHAR PRIMARY KEY, data VARCHAR NOT NULL)"
	);
}
