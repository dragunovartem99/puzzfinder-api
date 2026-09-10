import type { DuckDBInstance } from "@duckdb/node-api";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import type { FastifyError } from "fastify";

import { PuzzleController } from "./controllers/PuzzleController.ts";
import { PuzzleRepository } from "./repositories/PuzzleRepository.ts";
import { puzzleRoutes } from "./routes/puzzleRoutes.ts";
import { PuzzleService } from "./services/PuzzleService.ts";

type AppOptions = {
	db: DuckDBInstance;
	allowedOrigin: string;
	logger?: boolean;
	// Requests per minute per client IP.
	rateLimit?: number;
};

export async function buildApp(options: AppOptions) {
	const app = Fastify({
		logger: options.logger ?? true,
		// Search bodies are a few hundred bytes.
		bodyLimit: 16 * 1024,
		// The port is bound to loopback, so the only peer is Caddy (seen through
		// Docker's bridge); this makes req.ip the client address from X-Forwarded-For.
		trustProxy: "loopback, uniquelocal",
	});

	await app.register(cors, { origin: options.allowedOrigin });
	await app.register(rateLimit, { max: options.rateLimit ?? 120, timeWindow: "1 minute" });

	// Must be set before routes are registered: each route binds
	// the error handler of its context at registration time.
	app.setErrorHandler((error: FastifyError, req, reply) => {
		// Covers HttpError, validation (400), malformed JSON (400),
		// oversized bodies (413) and rate limiting (429).
		const status = error.statusCode ?? 500;
		if (status < 500) return reply.status(status).send({ error: error.message });
		req.log.error(error);
		return reply.status(500).send({ error: "Internal server error" });
	});

	const repository = new PuzzleRepository(options.db);
	const service = new PuzzleService(repository);
	const controller = new PuzzleController(service);

	await app.register(puzzleRoutes(controller), { prefix: "/api" });

	return app;
}
