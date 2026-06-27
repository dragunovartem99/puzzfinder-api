import app from "./app.ts";
import { initCache } from "./config/cache.ts";
import { PORT } from "./config/server.ts";

await initCache();

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
