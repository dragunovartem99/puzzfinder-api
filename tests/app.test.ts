import assert from "node:assert/strict";
import { after, test } from "node:test";

import { createTestApp } from "./helpers.ts";

const { app } = await createTestApp();
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

test("rejects pages beyond the result window", async () => {
	const response = await app.inject({
		method: "POST",
		url: "/api/puzzles/search",
		payload: { pagination: { page: 101, limit: 100 } },
	});

	assert.equal(response.statusCode, 400);
	assert.match(response.json().error, /first 10000 results/u);
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

test("rejects invalid JSON with 400", async () => {
	const response = await app.inject({
		method: "POST",
		url: "/api/puzzles/search",
		headers: { "content-type": "application/json" },
		payload: "{not json",
	});

	assert.equal(response.statusCode, 400);
});

test("rejects an unknown theme", async () => {
	const response = await app.inject({
		method: "POST",
		url: "/api/puzzles/search",
		payload: { filters: { themes: ["notATheme"] } },
	});

	assert.equal(response.statusCode, 400);
});

test("returns a cacheable puzzle by id", async () => {
	const response = await app.inject({ method: "GET", url: "/api/puzzles/aaaaa" });

	assert.equal(response.statusCode, 200);
	assert.equal(response.json().puzzleId, "aaaaa");
	assert.match(response.headers["cache-control"] as string, /max-age=/u);
});

test("returns 404 for an unknown id", async () => {
	const response = await app.inject({ method: "GET", url: "/api/puzzles/zzzzz" });

	assert.equal(response.statusCode, 404);
	assert.deepEqual(response.json(), { error: "Puzzle zzzzz not found" });
	assert.equal(response.headers["cache-control"], undefined);
});

test("rate limits a client with 429", async () => {
	const { app: limited } = await createTestApp({ rateLimit: 1 });
	after(() => limited.close());

	await limited.inject({ method: "GET", url: "/api/puzzles/aaaaa" });
	const response = await limited.inject({ method: "GET", url: "/api/puzzles/aaaaa" });

	assert.equal(response.statusCode, 429);
	assert.match(response.json().error, /rate limit/iu);
});
