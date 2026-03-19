import type { Knex } from "knex";

import knex from "knex";

export function createKnexConfig(): Knex.Config {
	return {
		client: "better-sqlite3",
		connection: { filename: process.env.DB_PATH },
		useNullAsDefault: true,
	};
}

export const queryBuilder = knex(createKnexConfig());
