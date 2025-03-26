const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export function getPagination(query) {
	const page = parseInt(query.page) || DEFAULT_PAGE;
	const limit = Math.min(parseInt(query.limit) || DEFAULT_LIMIT, MAX_LIMIT);
	const offset = (page - 1) * limit;
	return { page, limit, offset };
}
