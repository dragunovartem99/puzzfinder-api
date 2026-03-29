import app from "./app.ts";
import { PORT } from "./config/server.ts";
import { initCache } from "./config/database.ts";

await initCache();

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
