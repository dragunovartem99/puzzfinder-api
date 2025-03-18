import { connect } from "mongoose";
import { PuzzleModel } from "./model.js";

main().catch((err) => console.log(err));

async function main() {
	await connect("mongodb://127.0.0.1:27017/puzzfinder");
	PuzzleModel.find({ rating: { $gt: 3300 } }).then(console.log);
}
