import assert from "node:assert/strict";
import { test } from "node:test";

import { THEMES } from "../constants/themes.ts";
import { componentEnum } from "../schemas/openapi.ts";

// THEMES order defines the database bitmask, so it must stay a TS constant;
// the contract duplicates it as an enum. This test pins the two together.
test("contract theme enum matches the bitmask theme list", () => {
	assert.deepEqual(componentEnum("PuzzleTheme"), [...THEMES]);
});

test("contract sort fields are sortable puzzle columns", () => {
	assert.deepEqual(componentEnum("SortField"), [
		"rating",
		"movesNumber",
		"popularity",
		"nbPlays",
		"puzzleId",
	]);
});
