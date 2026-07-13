import type { DuckDBConnection } from "@duckdb/node-api";
import cors from "@fastify/cors";
import Fastify from "fastify";
import type { FastifyError } from "fastify";

import { Cache } from "./cache/index.ts";
import { PuzzleController } from "./controllers/PuzzleController.ts";
import { HttpError } from "./errors/HttpError.ts";
import { PuzzleRepository } from "./repositories/PuzzleRepository.ts";
import { puzzleRoutes } from "./routes/puzzleRoutes.ts";
import { PuzzleService } from "./services/PuzzleService.ts";

type AppOptions = {
	db: DuckDBConnection;
	cacheDb: DuckDBConnection;
	allowedOrigin: string;
	logger?: boolean;
};

export async function buildApp(options: AppOptions) {
	const app = Fastify({ logger: options.logger ?? true });

	await app.register(cors, { origin: options.allowedOrigin });

	// Must be set before routes are registered: each route binds
	// the error handler of its context at registration time.
	app.setErrorHandler((error: FastifyError, req, reply) => {
		if (error instanceof HttpError) {
			if (error.statusCode >= 500) req.log.error(error);
			return reply.status(error.statusCode).send({ error: error.message });
		}
		if (error.validation) {
			return reply.status(400).send({ error: error.message });
		}
		req.log.error(error);
		return reply.status(500).send({ error: "Internal server error" });
	});

	const cache = new Cache(options.cacheDb);
	await cache.init();
	const repository = new PuzzleRepository(options.db);
	const service = new PuzzleService(repository, cache);
	const controller = new PuzzleController(service);

	await app.register(puzzleRoutes(controller), { prefix: "/api" });

	return app;
}
