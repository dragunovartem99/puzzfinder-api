import mongoose from "mongoose";

const puzzleSchema = new mongoose.Schema({
	puzzleId: String,
	fen: String,
	moves: String,
	rating: Number,
	ratingDeviation: Number,
	popularity: Number,
	nbPlays: Number,
	themes: String,
	gameUrl: String,
	openingTags: String,
});

export const PuzzleModel = mongoose.model("Puzzle", puzzleSchema);
