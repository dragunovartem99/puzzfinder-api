import { server } from "./components/server.js";
import { databaseSearch } from "./functions/databaseSearch.js";

server.listen(50000, () => console.log(`Puzzfinder API listening on port 50000`));

server.get("/puzzles", async (req, res) => {
	const { data, pagination } = databaseSearch(req.query);
	res.json({ data, pagination });
});
