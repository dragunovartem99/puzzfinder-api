import type { DuckDBConnection } from "@duckdb/node-api";

export type PaginationOptions = {
	page: number;
	limit: number;
};

type PaginationMeta = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

type PaginatedResult<T> = {
	data: T[];
	pagination: PaginationMeta;
};

const DEFAULT_PAGINATION: PaginationOptions = {
	page: 1,
	limit: 10,
};

export async function paginateQuery<T>(
	conn: DuckDBConnection,
	sql: string,
	params: unknown[],
	options?: PaginationOptions
): Promise<PaginatedResult<T>> {
	const { page, limit } = { ...DEFAULT_PAGINATION, ...options };
	const offset = (page - 1) * limit;

	const [dataResult, countResult] = await Promise.all([
		conn.runAndReadAll(`${sql} LIMIT ? OFFSET ?`, [...params, limit, offset]),
		conn.runAndReadAll(`SELECT COUNT(*) as total FROM (${sql}) t`, params),
	]);

	const data = dataResult.getRowObjects() as T[];
	const total = Number((countResult.getRowObjects()[0] as { total: bigint }).total);

	return {
		data,
		pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
	};
}
