import assert from "node:assert/strict";
import { test } from "node:test";

import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";
import { PuzzleRepository } from "../repositories/PuzzleRepository.ts";
import { createPuzzleDatabase, SEED_PUZZLES } from "./helpers.ts";

const repository = new PuzzleRepository(await createPuzzleDatabase());

async function search(options: PuzzleSearchOptions, limit = 10, offset = 0) {
	const compiled = repository.compile(options);
	const [data, total] = await Promise.all([
		repository.findPuzzles(compiled, limit, offset),
		repository.countPuzzles(compiled),
	]);
	return { ids: data.map((puzzle) => puzzle.puzzleId), total };
}

test("returns all puzzles without filters", async () => {
	const result = await search({});
	assert.equal(result.total, SEED_PUZZLES.length);
});

test("filters by range", async () => {
	const result = await search({ filters: { rating: { min: 1550 } } });
	assert.deepEqual(result.ids.toSorted(), ["bbbbb", "ccccc", "ddddd"]);
});

test("filters by exact value", async () => {
	const result = await search({ filters: { rating: { equals: 1500 } } });
	assert.deepEqual(result.ids, ["aaaaa"]);
});

test("requires all requested themes", async () => {
	const forkOnly = await search({ filters: { themes: ["fork"] } });
	assert.deepEqual(forkOnly.ids.toSorted(), ["aaaaa", "bbbbb"]);

	const forkEndgame = await search({ filters: { themes: ["fork", "endgame"] } });
	assert.deepEqual(forkEndgame.ids, ["aaaaa"]);
});

test("sorts by the requested field and breaks ties by puzzleId", async () => {
	const result = await search({ sort: { field: "rating", order: "desc" } });
	assert.deepEqual(result.ids, ["ccccc", "bbbbb", "ddddd", "aaaaa"]);
});

test("orders by puzzleId when no sort is given", async () => {
	const result = await search({});
	assert.deepEqual(result.ids, ["aaaaa", "bbbbb", "ccccc", "ddddd"]);
});

test("paginates results", async () => {
	const result = await search({ sort: { field: "rating", order: "asc" } }, 1, 1);
	assert.deepEqual(result.ids, ["bbbbb"]);
});

test("compiles equivalent searches identically", () => {
	assert.deepEqual(
		repository.compile({ filters: { themes: ["fork", "endgame"], rating: { min: 1 } } }),
		repository.compile({ filters: { rating: { min: 1 }, themes: ["endgame", "fork"] } })
	);
});

test("decodes the theme bitmask into theme names", async () => {
	const puzzle = await repository.getPuzzleById("aaaaa");
	assert.deepEqual(puzzle?.themes.toSorted(), ["endgame", "fork"]);
});

test("returns null for an unknown id", async () => {
	assert.equal(await repository.getPuzzleById("zzzzz"), null);
});
