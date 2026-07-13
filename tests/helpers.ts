import { DuckDBInstance } from "@duckdb/node-api";
import type { DuckDBConnection } from "@duckdb/node-api";

import { buildApp } from "../app.ts";
import type { PuzzleTheme } from "../models/Theme.ts";
import { encodeThemes } from "../utils/themes.ts";

type SeedPuzzle = {
	puzzleId: string;
	rating: number;
	movesNumber: number;
	popularity: number;
	nbPlays: number;
	themes: PuzzleTheme[];
};

export const SEED_PUZZLES: SeedPuzzle[] = [
	{
		puzzleId: "aaaaa",
		rating: 1500,
		movesNumber: 2,
		popularity: 90,
		nbPlays: 100,
		themes: ["fork", "endgame"],
	},
	{
		puzzleId: "bbbbb",
		rating: 1600,
		movesNumber: 4,
		popularity: 80,
		nbPlays: 200,
		themes: ["fork"],
	},
	{
		puzzleId: "ccccc",
		rating: 1700,
		movesNumber: 6,
		popularity: 70,
		nbPlays: 300,
		themes: ["mateIn2", "endgame"],
	},
];

export async function createPuzzleConnection(): Promise<DuckDBConnection> {
	const conn = await (await DuckDBInstance.create(":memory:")).connect();
	await conn.run(
		`CREATE TABLE puzzles (
			puzzleId VARCHAR PRIMARY KEY,
			fen VARCHAR NOT NULL,
			moves VARCHAR NOT NULL,
			movesNumber INTEGER NOT NULL,
			rating INTEGER NOT NULL,
			ratingDeviation INTEGER NOT NULL,
			popularity INTEGER NOT NULL,
			nbPlays INTEGER NOT NULL,
			gameUrl VARCHAR NOT NULL,
			openingTags VARCHAR,
			theme_mask HUGEINT
		)`
	);
	for (const puzzle of SEED_PUZZLES) {
		const mask = encodeThemes(puzzle.themes);
		await conn.run(
			`INSERT INTO puzzles VALUES (?, 'fen', 'e2e4 e7e5', ?, ?, 75, ?, ?, 'https://lichess.org/x', NULL, ${mask}::HUGEINT)`,
			[puzzle.puzzleId, puzzle.movesNumber, puzzle.rating, puzzle.popularity, puzzle.nbPlays]
		);
	}
	return conn;
}

export async function createCacheConnection(): Promise<DuckDBConnection> {
	return await (await DuckDBInstance.create(":memory:")).connect();
}

export async function createTestApp() {
	const db = await createPuzzleConnection();
	const cacheDb = await createCacheConnection();
	const app = await buildApp({ db, cacheDb, allowedOrigin: "*", logger: false });
	return { app, db, cacheDb };
}
