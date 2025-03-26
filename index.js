import express from "express";
import { db } from "./components/db.js";
import { getPagination } from "./functions/getPagination.js";

const app = express();
const port = 50000;

app.get("/puzzles", async (req, res) => {
	const { query } = req;
	const pagination = getPagination(query);

	// TODO: Refactor this mess
	const conditions = ["themes LIKE '%mate%'"];
	const params = [];

	if (query.minRating !== undefined) {
		conditions.push("rating >= ?");
		params.push(query.minRating);
	}

	if (query.maxRating !== undefined) {
		conditions.push("rating <= ?");
		params.push(query.maxRating);
	}

	const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

	const dataSql = [
		"SELECT * FROM puzzles",
		whereClause,
		"ORDER BY rating DESC",
		`LIMIT ${pagination.limit} OFFSET ${pagination.offset}`,
	]
		.join(" ")
		.replace(/\s+/g, " ")
		.trim();

	const countSql = ["SELECT COUNT(*) as total FROM puzzles", whereClause]
		.join(" ")
		.replace(/\s+/g, " ")
		.trim();

	const statement = db.prepare(dataSql);
	const countStatement = db.prepare(countSql);

	const results = params.length > 0 ? statement.all(...params) : statement.all();
	const totalResult = params.length > 0 ? countStatement.get(...params) : countStatement.get();
	const total = totalResult.total;

	res.json({
		data: results,
		pagination: {
			total,
			page: pagination.page,
			limit: pagination.limit,
			totalPages: Math.ceil(total / pagination.limit),
		},
	});
});

app.listen(port, () => console.log(`PuzzFinder API listening on port ${port}`));
