import assert from "node:assert/strict";
import { test } from "node:test";

import { Cache } from "../cache/index.ts";
import { createCacheConnection } from "./helpers.ts";

test("keeps cached results while the DB version is unchanged", async () => {
	const cache = new Cache(await createCacheConnection());
	await cache.init("v1");
	await cache.set("key", { total: 1 });

	await cache.init("v1");

	assert.deepEqual(await cache.get("key"), { total: 1 });
});

test("drops cached results when the DB version changes", async () => {
	const cache = new Cache(await createCacheConnection());
	await cache.init("v1");
	await cache.set("key", { total: 1 });

	await cache.init("v2");

	assert.equal(await cache.get("key"), null);
});
