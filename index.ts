import { databaseSearch } from "./functions/databaseSearch.js";
import { ExpressServer } from "./server/objects/ExpressServer.ts";

const server = new ExpressServer();

server.listen(50000);

server.onRequest("post", "/puzzles", async (req, res) => {
	try {
		const { data, pagination } = databaseSearch(req.body);
		res.json({ data, pagination });
	} catch (e) {
		console.error("Search failed:", e);
		res.status(500).json({ error: "Internal server error" });
	}
});
