import { DuckDBInstance } from "@duckdb/node-api";

let instance: DuckDBInstance | null = null;

export async function getConnection() {
	if (!instance) {
		instance = await DuckDBInstance.create(process.env.DB_PATH || "");
	}
	return instance.connect();
}
