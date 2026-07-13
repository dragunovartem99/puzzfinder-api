import type { FastifyInstance } from "fastify";

import { PuzzleController } from "../controllers/PuzzleController.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";
import { bodySchema, paramsSchema } from "../schemas/openapi.ts";

export function puzzleRoutes(controller: PuzzleController) {
	return function routes(app: FastifyInstance) {
		app.post<{ Body: PuzzleSearchOptions }>(
			"/puzzles/search",
			{ schema: { body: bodySchema("/api/puzzles/search", "post") } },
			controller.searchPuzzles.bind(controller)
		);
		app.get<{ Params: { id: string } }>(
			"/puzzles/:id",
			{ schema: { params: paramsSchema("/api/puzzles/{id}", "get") } },
			controller.getPuzzleById.bind(controller)
		);
	};
}
