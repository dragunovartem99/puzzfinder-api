import { DuckDBInstance } from "@duckdb/node-api";

let instance: DuckDBInstance | null = null;

export async function getCacheConnection() {
	if (!instance) {
		instance = await DuckDBInstance.create("cache.db");
	}
	return instance.connect();
}
