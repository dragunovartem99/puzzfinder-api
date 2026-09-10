import { stat } from "node:fs/promises";

import { DuckDBInstance } from "@duckdb/node-api";
import type { DuckDBConnection } from "@duckdb/node-api";

export type Database = {
	connection: DuckDBConnection;
	close: () => void;
};

// Changes whenever the DB file is rebuilt; read before opening, since DuckDB may touch the file.
export async function getDatabaseVersion(path: string): Promise<string> {
	const { size, mtimeMs } = await stat(path);
	return `${size}-${mtimeMs}`;
}

export async function openDatabase(path: string): Promise<Database> {
	const instance = await DuckDBInstance.create(path);
	const connection = await instance.connect();

	return {
		connection,
		close() {
			connection.closeSync();
			instance.closeSync();
		},
	};
}
