import assert from "node:assert/strict";
import { test } from "node:test";

import { PuzzleRepository } from "../repositories/PuzzleRepository.ts";
import { createPuzzleConnection, SEED_PUZZLES } from "./helpers.ts";

const repository = new PuzzleRepository(await createPuzzleConnection());

function ids(result: { data: { puzzleId: string }[] }): string[] {
	return result.data.map((puzzle) => puzzle.puzzleId);
}

test("returns all puzzles without filters", async () => {
	const result = await repository.searchPuzzles({});
	assert.equal(result.pagination.total, SEED_PUZZLES.length);
});

test("filters by range", async () => {
	const result = await repository.searchPuzzles({ filters: { rating: { min: 1550 } } });
	assert.deepEqual(ids(result).toSorted(), ["bbbbb", "ccccc"]);
});

test("filters by exact value", async () => {
	const result = await repository.searchPuzzles({ filters: { rating: { equals: 1500 } } });
	assert.deepEqual(ids(result), ["aaaaa"]);
});

test("requires all requested themes", async () => {
	const forkOnly = await repository.searchPuzzles({ filters: { themes: ["fork"] } });
	assert.deepEqual(ids(forkOnly).toSorted(), ["aaaaa", "bbbbb"]);

	const forkEndgame = await repository.searchPuzzles({
		filters: { themes: ["fork", "endgame"] },
	});
	assert.deepEqual(ids(forkEndgame), ["aaaaa"]);
});

test("sorts by the requested field and order", async () => {
	const result = await repository.searchPuzzles({ sort: { field: "rating", order: "desc" } });
	assert.deepEqual(ids(result), ["ccccc", "bbbbb", "aaaaa"]);
});

test("paginates results", async () => {
	const result = await repository.searchPuzzles({
		sort: { field: "rating", order: "asc" },
		pagination: { page: 2, limit: 1 },
	});
	assert.deepEqual(ids(result), ["bbbbb"]);
	assert.equal(result.pagination.totalPages, 3);
});

test("decodes the theme bitmask into theme names", async () => {
	const puzzle = await repository.getPuzzleById("aaaaa");
	assert.deepEqual(puzzle?.themes.toSorted(), ["endgame", "fork"]);
});

test("returns null for an unknown id", async () => {
	assert.equal(await repository.getPuzzleById("zzzzz"), null);
});
