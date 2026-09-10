import assert from "node:assert/strict";
import { test } from "node:test";

import { PuzzleRepository } from "../repositories/PuzzleRepository.ts";
import { PuzzleService } from "../services/PuzzleService.ts";
import { createPuzzleDatabase } from "./helpers.ts";

async function countingService() {
	const repository = new PuzzleRepository(await createPuzzleDatabase());
	const calls = { find: 0, count: 0 };
	const find = repository.findPuzzles.bind(repository);
	const count = repository.countPuzzles.bind(repository);
	repository.findPuzzles = (...args) => (calls.find++, find(...args));
	repository.countPuzzles = (...args) => (calls.count++, count(...args));
	return { service: new PuzzleService(repository), calls };
}

test("serves a repeated search from the cache", async () => {
	const { service, calls } = await countingService();

	const first = await service.searchPuzzles({ filters: { themes: ["fork"] } });
	const second = await service.searchPuzzles({ filters: { themes: ["fork"] } });

	assert.deepEqual(second, first);
	assert.deepEqual(calls, { find: 1, count: 1 });
});

test("reuses the count across pages and sort orders", async () => {
	const { service, calls } = await countingService();
	const filters = { rating: { min: 1500 } };

	await service.searchPuzzles({ filters, pagination: { page: 1, limit: 1 } });
	await service.searchPuzzles({ filters, pagination: { page: 2, limit: 1 } });
	await service.searchPuzzles({ filters, sort: { field: "rating", order: "desc" } });

	assert.deepEqual(calls, { find: 3, count: 1 });
});

test("treats theme order as the same search", async () => {
	const { service, calls } = await countingService();

	await service.searchPuzzles({ filters: { themes: ["fork", "endgame"] } });
	await service.searchPuzzles({ filters: { themes: ["endgame", "fork"] } });

	assert.deepEqual(calls, { find: 1, count: 1 });
});
