import express from "express";
import { connect } from "mongoose";
import { usePagination } from "./modules/pagination.js";
import { searchPuzzles } from "./modules/searchPuzzles.js";

const app = express();
const port = 50000;

connect("mongodb://127.0.0.1:27017/puzzfinder").catch(console.log);

app.get("/puzzles", async (req, res) => {
	const pagination = usePagination(req.query);
	const puzzles = await searchPuzzles(req.query, pagination);

	const totalCount = puzzles[0].metadata[0].totalCount;

	res.json({
		pagination: {
			totalCount,
			page: pagination.page,
			limit: pagination.limit,
		},
		data: puzzles[0].data,
	});
});

app.listen(port, () => {
	console.log(`PuzzFinder API listening on port ${port}`);
});
