import mongoose from "mongoose";

const puzzleSchema = new mongoose.Schema({
	_id: String,
	FEN: String,
	Moves: String,
	Rating: Number,
	RatingDeviation: Number,
	Popularity: Number,
	NbPlays: Number,
	Themes: String,
	GameUrl: String,
	OpeningTags: String,
});

export const PuzzleModel = mongoose.model("Puzzle", puzzleSchema);
