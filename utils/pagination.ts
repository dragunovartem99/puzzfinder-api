import { type Knex } from "knex";

type PaginationOptions = { page?: number; limit?: number };

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

const DEFAULT_PAGINATION = { page: 1, limit: 10 };

export async function paginateQuery<T>(
	query: Knex.QueryBuilder,
	options?: PaginationOptions
): Promise<PaginatedResult<T>> {
	const { page, limit } = { ...DEFAULT_PAGINATION, ...options };
	const offset = (page - 1) * limit;

	const [data, totalResult] = await Promise.all([
		query.clone().limit(limit).offset(offset),
		query.clone().count("* as total").first(),
	]);

	const total = Number(totalResult.total);
	const totalPages = Math.ceil(total / limit);

	return {
		data,
		pagination: { page, limit, total, totalPages },
	};
}
