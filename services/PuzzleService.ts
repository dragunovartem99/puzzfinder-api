import { QueryCache } from "../cache/index.ts";
import type { Puzzle, PaginatedPuzzles } from "../models/Puzzle.ts";
import type { PuzzleSearchOptions } from "../models/PuzzleFilter.ts";
import { PuzzleRepository } from "../repositories/PuzzleRepository.ts";
import { paginationMeta, resolvePagination } from "../utils/pagination.ts";

export type SearchCaches = {
	// Keyed by filters only, so every page and sort order of a search shares one count.
	counts: QueryCache<number>;
	pages: QueryCache<Puzzle[]>;
};

export function createSearchCaches(): SearchCaches {
	return {
		counts: new QueryCache({ max: 100_000 }),
		// Bounded by puzzles held (~0.5 KB each), not by entries: a page holds up to 100.
		pages: new QueryCache({
			maxSize: 100_000,
			sizeCalculation: (puzzles) => Math.max(puzzles.length, 1),
		}),
	};
}

export class PuzzleService {
	#repository: PuzzleRepository;
	#caches: SearchCaches;

	constructor(repository: PuzzleRepository, caches: SearchCaches = createSearchCaches()) {
		this.#repository = repository;
		this.#caches = caches;
	}

	async searchPuzzles(options: PuzzleSearchOptions): Promise<PaginatedPuzzles> {
		const pagination = resolvePagination(options.pagination);
		const search = this.#repository.compile(options);

		const countKey = JSON.stringify([search.where, search.params]);
		const pageKey = JSON.stringify([
			search.where,
			search.params,
			search.orderBy,
			pagination.limit,
			pagination.offset,
		]);

		const [data, total] = await Promise.all([
			this.#caches.pages.getOrCompute(pageKey, () =>
				this.#repository.findPuzzles(search, pagination.limit, pagination.offset)
			),
			this.#caches.counts.getOrCompute(countKey, () => this.#repository.countPuzzles(search)),
		]);

		return { data, pagination: paginationMeta(pagination, total) };
	}

	getPuzzleById(id: string): Promise<Puzzle | null> {
		return this.#repository.getPuzzleById(id);
	}
}
