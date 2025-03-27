import { app } from "./components/app.js";
import { db } from "./components/db.js";
import { getPagination } from "./functions/getPagination.js";
import { parseFilters } from "./functions/parseFilters.js";

app.listen(50000, () => console.log(`Puzzfinder API listening on port 50000`));

app.get("/puzzles", async (req, res) => {
	const filters = parseFilters(req.query);
	const { sql: whereSql, params } = filters.toSQL();
	const whereClause = whereSql ? `WHERE ${whereSql}` : "";

	const pagination = getPagination(req.query);

	const dataSql = [
		"SELECT * FROM puzzles",
		whereClause,
		`LIMIT ${pagination.limit} OFFSET ${pagination.offset}`,
	].join(" ");

	const countSql = `SELECT COUNT(*) as total FROM puzzles ${whereClause}`;

	const [puzzles, { total }] = [
		db.prepare(dataSql).all([...params]),
		db.prepare(countSql).get([...params]),
	];

	res.json({
		data: puzzles,
		pagination: {
			total,
			page: pagination.page,
			limit: pagination.limit,
			totalPages: Math.ceil(total / pagination.limit),
		},
	});
});
