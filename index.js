import express from "express";
import { db } from "./components/db.js";

const app = express();
const port = 50000;

app.get("/puzzles", async (req, res) => {
	const rows = db.prepare("SELECT * FROM puzzles ORDER BY rating DESC LIMIT 100").all();
	res.json(rows);
});

app.listen(port, () => {
	console.log(`PuzzFinder API listening on port ${port}`);
});
