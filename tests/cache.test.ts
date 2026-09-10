import assert from "node:assert/strict";
import { test } from "node:test";
import { setTimeout as sleep } from "node:timers/promises";

import { QueryCache } from "../cache/index.ts";

test("computes once and serves repeats from the cache", async () => {
	const cache = new QueryCache<number>({ max: 10 });
	let calls = 0;
	const compute = () => Promise.resolve(++calls);

	assert.equal(await cache.getOrCompute("key", compute), 1);
	assert.equal(await cache.getOrCompute("key", compute), 1);
	assert.equal(calls, 1);
});

test("shares one computation between concurrent callers", async () => {
	const cache = new QueryCache<number>({ max: 10 });
	let calls = 0;
	const compute = async () => {
		calls++;
		await sleep(10);
		return 42;
	};

	const results = await Promise.all([
		cache.getOrCompute("key", compute),
		cache.getOrCompute("key", compute),
	]);

	assert.deepEqual(results, [42, 42]);
	assert.equal(calls, 1);
});

test("does not cache failures", async () => {
	const cache = new QueryCache<number>({ max: 10 });

	await assert.rejects(cache.getOrCompute("key", () => Promise.reject(new Error("boom"))));

	assert.equal(await cache.getOrCompute("key", () => Promise.resolve(7)), 7);
});

test("evicts the least recently used entry beyond max", async () => {
	const cache = new QueryCache<number>({ max: 2 });
	let calls = 0;
	const compute = () => Promise.resolve(++calls);

	await cache.getOrCompute("a", compute);
	await cache.getOrCompute("b", compute);
	await cache.getOrCompute("c", compute);
	await cache.getOrCompute("a", compute);

	assert.equal(calls, 4);
});
