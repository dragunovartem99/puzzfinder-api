import assert from "node:assert/strict";
import { after, test } from "node:test";

import { createTestApp } from "./helpers.ts";

const { app, cacheDb } = await createTestApp();
after(() => app.close());

test("searches puzzles and reports pagination", async () => {
	const response = await app.inject({
		method: "POST",
		url: "/api/puzzles/search",
		payload: { filters: { themes: ["fork"] }, sort: { field: "rating", order: "asc" } },
	});

	assert.equal(response.statusCode, 200);
	const body = response.json();
	assert.deepEqual(
		body.data.map((puzzle: { puzzleId: string }) => puzzle.puzzleId),
		["aaaaa", "bbbbb"]
	);
	assert.equal(body.pagination.total, 2);
});

test("fills pagination defaults from the contract", async () => {
	const response = await app.inject({
		method: "POST",
		url: "/api/puzzles/search",
		payload: { pagination: { page: 2 } },
	});

	assert.equal(response.json().pagination.limit, 10);
	assert.equal(response.json().pagination.page, 2);
});

test("caches search results", async () => {
	const payload = { filters: { rating: { min: 1600 } } };
	await app.inject({ method: "POST", url: "/api/puzzles/search", payload });

	const cached = await cacheDb.runAndReadAll("SELECT COUNT(*) AS total FROM search_cache");
	assert.equal((cached.getRowObjects()[0] as { total: bigint }).total > 0n, true);
});

test("rejects a malformed body", async () => {
	const response = await app.inject({
		method: "POST",
		url: "/api/puzzles/search",
		payload: { filters: { rating: { min: "abc" } } },
	});

	assert.equal(response.statusCode, 400);
	assert.match(response.json().error, /must be number/u);
});

test("rejects an unknown theme", async () => {
	const response = await app.inject({
		method: "POST",
		url: "/api/puzzles/search",
		payload: { filters: { themes: ["notATheme"] } },
	});

	assert.equal(response.statusCode, 400);
});

test("returns a puzzle by id", async () => {
	const response = await app.inject({ method: "GET", url: "/api/puzzles/aaaaa" });

	assert.equal(response.statusCode, 200);
	assert.equal(response.json().puzzleId, "aaaaa");
});

test("returns 404 for an unknown id", async () => {
	const response = await app.inject({ method: "GET", url: "/api/puzzles/zzzzz" });

	assert.equal(response.statusCode, 404);
	assert.deepEqual(response.json(), { error: "Puzzle zzzzz not found" });
});
