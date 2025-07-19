import type { Knex } from "knex";

import knex from "knex";
import path from "path";

export function createKnexConfig(): Knex.Config {
	return {
		client: "better-sqlite3",
		connection: { filename: path.join("db", "puzzfinder.db") },
		useNullAsDefault: true,
	};
}

export const queryBuilder = knex(createKnexConfig());
