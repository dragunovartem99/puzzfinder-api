import { DuckDBInstance } from "@duckdb/node-api";

let instance: DuckDBInstance | null = null;

async function getInstance() {
	if (!instance) {
		instance = await DuckDBInstance.create("cache.db");
	}
	return instance;
}

export async function initCache() {
	const conn = await (await getInstance()).connect();
	await conn.run(
		"CREATE TABLE IF NOT EXISTS search_cache (cache_key VARCHAR PRIMARY KEY, data VARCHAR NOT NULL)"
	);
}

export async function getCache<T>(key: string): Promise<T | null> {
	const conn = await (await getInstance()).connect();
	const result = await conn.runAndReadAll("SELECT data FROM search_cache WHERE cache_key = ?", [
		key,
	]);
	const row = (result.getRowObjects() as { data: string }[])[0];
	return row ? (JSON.parse(row.data) as T) : null;
}

export async function setCache<T>(key: string, data: T): Promise<void> {
	const conn = await (await getInstance()).connect();
	await conn.run("INSERT INTO search_cache (cache_key, data) VALUES (?, ?)", [
		key,
		JSON.stringify(data),
	]);
}
