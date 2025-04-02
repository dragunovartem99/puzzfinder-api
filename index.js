import express from "express";
import cors from "cors";
import { databaseSearch } from "./functions/databaseSearch.js";

const server = express();
server.use(express.json()).use(cors());

server.listen(50000, () => console.log(`Puzzfinder API listening on port 50000`));

server.post("/puzzles", async (req, res) => {
	const { data, pagination } = databaseSearch(req.body);
	res.json({ data, pagination });
});
