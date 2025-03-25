import express from "express";
import { connect } from "mongoose";
import { PuzzleModel } from "./models/puzzle.js";
import { toDbQuery } from "./modules/dbQuery.js";
import { usePagination } from "./modules/pagination.js";

const app = express();
const port = 50000;

connect("mongodb://127.0.0.1:27017/puzzfinder").catch(console.error);

app.get("/puzzles", async (req, res) => {
	const dbQuery = toDbQuery(req.query);
	const { page, skip, limit } = usePagination(req.query);

	const puzzles = await PuzzleModel.aggregate([
		{ $match: dbQuery },
		{
			$facet: {
				metadata: [{ $count: "totalCount" }],
				data: [{ $skip: skip }, { $limit: limit }],
			},
		},
	]);

	res.json({
		pagination: { totalCount: puzzles[0].metadata[0].totalCount, page, limit },
		data: puzzles[0].data,
	});
});

app.listen(port, () => {
	console.log(`PuzzFinder API listening on port ${port}`);
});
