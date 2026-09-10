import { DuckDBInstance } from "@duckdb/node-api";

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
	// Shares bbbbb's rating to exercise the puzzleId tie-breaker.
	{
		puzzleId: "ddddd",
		rating: 1600,
		movesNumber: 3,
		popularity: 60,
		nbPlays: 400,
		themes: ["mateIn2"],
	},
];

export async function createPuzzleDatabase(): Promise<DuckDBInstance> {
	const db = await DuckDBInstance.create(":memory:");
	const conn = await db.connect();
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
	conn.closeSync();
	return db;
}

export async function createTestApp(options: { rateLimit?: number } = {}) {
	const db = await createPuzzleDatabase();
	const app = await buildApp({
		db,
		allowedOrigin: "*",
		logger: false,
		rateLimit: options.rateLimit ?? 1000,
	});
	return { app, db };
}
