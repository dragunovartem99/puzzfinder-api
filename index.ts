import { buildApp } from "./app.ts";
import { openDatabase } from "./config/database.ts";
import {
	ALLOWED_ORIGIN,
	DB_PATH,
	DUCKDB_MEMORY_LIMIT,
	DUCKDB_THREADS,
	PORT,
} from "./config/env.ts";

const db = await openDatabase(DB_PATH, {
	memoryLimit: DUCKDB_MEMORY_LIMIT,
	threads: DUCKDB_THREADS,
});

const app = await buildApp({ db, allowedOrigin: ALLOWED_ORIGIN });

async function shutdown(signal: string) {
	app.log.info(`Received ${signal}, shutting down`);
	await app.close();
	db.closeSync();
	process.exit(0);
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

try {
	await app.listen({ port: PORT, host: "0.0.0.0" });
} catch (error) {
	app.log.error(error);
	process.exit(1);
}
