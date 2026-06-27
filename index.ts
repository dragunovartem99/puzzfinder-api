import app from "./app.ts";
import { Cache } from "./cache/index.ts";
import { PORT } from "./config/server.ts";

await new Cache().init();

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
