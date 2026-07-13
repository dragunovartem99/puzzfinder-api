import type { components } from "../types/api.d.ts";

export type Puzzle = components["schemas"]["Puzzle"];
export type PaginatedPuzzles = components["schemas"]["PaginatedPuzzles"];

// Internal storage shape: themes live in a bitmask column, never on the wire.
export type DatabasePuzzle = Omit<Puzzle, "themes"> & { theme_mask: bigint };
