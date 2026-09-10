import { LRUCache } from "lru-cache";

// In-memory only: the puzzles DB is read-only while the process runs, and a DB
// rebuild restarts the API, so a restart is the invalidation.
export class QueryCache<T extends NonNullable<unknown>> {
	#lru: LRUCache<string, T>;
	#inflight = new Map<string, Promise<T>>();

	constructor(options: LRUCache.Options<string, T, unknown>) {
		this.#lru = new LRUCache(options);
	}

	// Concurrent calls with the same key share one computation.
	getOrCompute(key: string, compute: () => Promise<T>): Promise<T> {
		const hit = this.#lru.get(key);
		if (hit !== undefined) return Promise.resolve(hit);

		let pending = this.#inflight.get(key);
		if (!pending) {
			pending = compute()
				.then((value) => {
					this.#lru.set(key, value);
					return value;
				})
				.finally(() => this.#inflight.delete(key));
			this.#inflight.set(key, pending);
		}
		return pending;
	}
}
