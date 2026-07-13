import { DuckDBInstance } from "@duckdb/node-api";
import type { DuckDBConnection } from "@duckdb/node-api";

export type Database = {
	connection: DuckDBConnection;
	close: () => void;
};

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
