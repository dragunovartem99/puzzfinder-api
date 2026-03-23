import type { PuzzleTheme } from "../models/Theme.ts";

import { THEMES } from "../constants/themes.ts";

export function decodeThemes(theme_mask: bigint): PuzzleTheme[] {
	return THEMES.filter((_, i) => (theme_mask & (1n << BigInt(i))) !== 0n);
}

export function encodeThemes(themes: string[]): bigint {
	return themes.reduce((acc, theme) => {
		const bit = THEMES.indexOf(theme as PuzzleTheme);
		return bit !== -1 ? acc | (1n << BigInt(bit)) : acc;
	}, 0n);
}
