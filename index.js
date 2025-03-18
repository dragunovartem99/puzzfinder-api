import express from "express";
import { connect } from "mongoose";
import { PuzzleModel } from "./models/puzzle.js";
import { translateQuery } from "./utils/translateQuery.js";

const app = express();
const port = 9999;

connect("mongodb://127.0.0.1:27017/puzzfinder").catch((err) => console.log(err));

app.get("/puzzles", async (req, res) => {
	const query = translateQuery(req.query);
	const puzzles = await PuzzleModel.find(query);
	res.json(puzzles);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
