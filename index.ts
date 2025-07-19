import app from "./app.ts";

const PORT = 50000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
