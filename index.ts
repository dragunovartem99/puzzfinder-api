import { buildApp } from "./app.ts";
import { openDatabase } from "./config/database.ts";
import { ALLOWED_ORIGIN, CACHE_DB_PATH, DB_PATH, PORT } from "./config/env.ts";

const db = await openDatabase(DB_PATH);
const cacheDb = await openDatabase(CACHE_DB_PATH);

const app = await buildApp({
	db: db.connection,
	cacheDb: cacheDb.connection,
	allowedOrigin: ALLOWED_ORIGIN,
});

async function shutdown(signal: string) {
	app.log.info(`Received ${signal}, shutting down`);
	await app.close();
	db.close();
	cacheDb.close();
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
