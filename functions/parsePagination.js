const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export function parsePagination(pagination) {
	const page = parseInt(pagination.page) || DEFAULT_PAGE;
	const limit = Math.min(parseInt(pagination.limit) || DEFAULT_LIMIT, MAX_LIMIT);
	const offset = (page - 1) * limit;
	return { page, limit, offset };
}
