const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

const getPage = (query) => parseInt(query.page) || DEFAULT_PAGE;
const getLimit = (query) => Math.min(parseInt(query.limit) || DEFAULT_LIMIT, MAX_LIMIT);

export function usePagination(query) {
	const page = getPage(query);
	const limit = getLimit(query);
	const skip = (page - 1) * limit;
	return { page, limit, skip };
}
