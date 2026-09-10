import { BadRequestError } from "../errors/BadRequestError.ts";

export type PaginationOptions = {
	page: number;
	limit: number;
};

type Pagination = PaginationOptions & { offset: number };

type PaginationMeta = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

const DEFAULT_PAGINATION: PaginationOptions = {
	page: 1,
	limit: 10,
};

const MAX_LIMIT = 100;

// Deep OFFSETs make DuckDB sort and skip millions of rows (seconds per request),
// so only the first MAX_RESULT_WINDOW results of a search are reachable.
export const MAX_RESULT_WINDOW = 10_000;

export function resolvePagination(options?: Partial<PaginationOptions>): Pagination {
	const page = options?.page ?? DEFAULT_PAGINATION.page;
	const limit = Math.min(options?.limit ?? DEFAULT_PAGINATION.limit, MAX_LIMIT);
	const offset = (page - 1) * limit;

	if (offset + limit > MAX_RESULT_WINDOW) {
		throw new BadRequestError(
			`Only the first ${MAX_RESULT_WINDOW} results are reachable; narrow the filters`
		);
	}

	return { page, limit, offset };
}

export function paginationMeta({ page, limit }: Pagination, total: number): PaginationMeta {
	const reachable = Math.min(total, MAX_RESULT_WINDOW);
	return { page, limit, total, totalPages: Math.ceil(reachable / limit) };
}
