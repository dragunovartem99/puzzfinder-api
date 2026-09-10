import { DuckDBInstance } from "@duckdb/node-api";
import type { DuckDBConnection } from "@duckdb/node-api";

type DatabaseOptions = {
	memoryLimit?: string;
	threads?: string;
};

export function openDatabase(path: string, options: DatabaseOptions = {}): Promise<DuckDBInstance> {
	const config: Record<string, string> = { access_mode: "READ_ONLY" };
	if (options.memoryLimit) config.memory_limit = options.memoryLimit;
	if (options.threads) config.threads = options.threads;
	return DuckDBInstance.create(path, config);
}

// A DuckDB connection runs one query at a time, so each query gets its own
// connection; they are cheap and let concurrent requests run in parallel.
export async function withConnection<T>(
	instance: DuckDBInstance,
	fn: (conn: DuckDBConnection) => Promise<T>
): Promise<T> {
	const conn = await instance.connect();
	try {
		return await fn(conn);
	} finally {
		conn.closeSync();
	}
}
