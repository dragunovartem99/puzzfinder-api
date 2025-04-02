export function aggregateThemes(puzzle) {
	const prefix = "theme_";

	const themes = Object.keys(puzzle)
		.filter((key) => key.startsWith(prefix) && puzzle[key] === 1)
		.map((key) => key.slice(prefix.length));

	const noThemesPuzzle = Object.fromEntries(
		Object.entries(puzzle).filter(([key]) => !key.startsWith(prefix))
	);

	return { ...noThemesPuzzle, themes };
}
