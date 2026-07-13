import assert from "node:assert/strict";
import { test } from "node:test";

import type { DuckDBConnection } from "@duckdb/node-api";

import { paginateQuery } from "../utils/pagination.ts";

type RecordedCall = { sql: string; params: unknown[] };

function fakeConnection(total: bigint, calls: RecordedCall[]): DuckDBConnection {
	return {
		async runAndReadAll(sql: string, params: unknown[]) {
			calls.push({ sql, params });
			const rows = sql.includes("COUNT(*)") ? [{ total }] : [{ id: 1 }];
			return { getRowObjects: () => rows };
		},
	} as unknown as DuckDBConnection;
}

test("applies defaults when no pagination is given", async () => {
	const calls: RecordedCall[] = [];
	const result = await paginateQuery(fakeConnection(25n, calls), "SELECT 1", []);

	assert.equal(result.pagination.page, 1);
	assert.equal(result.pagination.limit, 10);
	assert.equal(result.pagination.total, 25);
	assert.equal(result.pagination.totalPages, 3);
});

test("computes OFFSET from page and limit", async () => {
	const calls: RecordedCall[] = [];
	await paginateQuery(fakeConnection(0n, calls), "SELECT 1", [], { page: 3, limit: 20 });

	const dataCall = calls.find((call) => call.sql.includes("LIMIT"))!;
	assert.deepEqual(dataCall.params, [20, 40]);
});

test("clamps limit to the maximum", async () => {
	const calls: RecordedCall[] = [];
	const result = await paginateQuery(fakeConnection(0n, calls), "SELECT 1", [], {
		page: 1,
		limit: 5000,
	});

	assert.equal(result.pagination.limit, 100);
});
