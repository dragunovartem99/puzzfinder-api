import { DuckDBInstance } from "@duckdb/node-api";

let instance: DuckDBInstance | null = null;
let cacheInstance: DuckDBInstance | null = null;

export async function getConnection() {
	if (!instance) {
		instance = await DuckDBInstance.create(process.env.DB_PATH || "");
	}
	return instance.connect();
}

export async function getCacheConnection() {
	if (!cacheInstance) {
		cacheInstance = await DuckDBInstance.create(process.env.CACHE_DB_PATH || "cache.db");
	}
	return cacheInstance.connect();
}

export async function initCache() {
	const conn = await getCacheConnection();
	await conn.run("DROP TABLE IF EXISTS search_cache");
	await conn.run(
		"CREATE TABLE search_cache (cache_key VARCHAR PRIMARY KEY, data VARCHAR NOT NULL)"
	);
}
