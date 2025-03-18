import express from "express";
import { connect } from "mongoose";
import { PuzzleModel } from "./model.js";
import { translateQuery } from "./utils/translateQuery.js";

const app = express();
const port = 3000;

connect("mongodb://127.0.0.1:27017/puzzfinder").catch((err) => console.log(err));

app.get("/puzzles", async (req, res) => {
	const puzzles = await PuzzleModel.find(translateQuery(req.query));
	res.json(puzzles);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
