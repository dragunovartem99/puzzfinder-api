import assert from "node:assert/strict";
import { test } from "node:test";

import { BadRequestError } from "../errors/BadRequestError.ts";
import { MAX_RESULT_WINDOW, paginationMeta, resolvePagination } from "../utils/pagination.ts";

test("applies defaults when no pagination is given", () => {
	assert.deepEqual(resolvePagination(), { page: 1, limit: 10, offset: 0 });
});

test("computes OFFSET from page and limit", () => {
	assert.equal(resolvePagination({ page: 3, limit: 20 }).offset, 40);
});

test("clamps limit to the maximum", () => {
	assert.equal(resolvePagination({ page: 1, limit: 5000 }).limit, 100);
});

test("allows the last page inside the result window", () => {
	const limit = 100;
	const page = MAX_RESULT_WINDOW / limit;
	assert.equal(resolvePagination({ page, limit }).offset, MAX_RESULT_WINDOW - limit);
});

test("rejects pages beyond the result window", () => {
	assert.throws(
		() => resolvePagination({ page: MAX_RESULT_WINDOW / 100 + 1, limit: 100 }),
		BadRequestError
	);
});

test("reports totalPages", () => {
	assert.equal(paginationMeta(resolvePagination(), 25).totalPages, 3);
});

test("caps totalPages at the result window but keeps the real total", () => {
	const meta = paginationMeta(resolvePagination({ page: 1, limit: 100 }), 3_000_000);
	assert.equal(meta.total, 3_000_000);
	assert.equal(meta.totalPages, MAX_RESULT_WINDOW / 100);
});
