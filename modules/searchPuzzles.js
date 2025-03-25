import { toDbQuery } from "./dbQuery.js";
import { PuzzleModel } from "../models/puzzle.js";

export async function searchPuzzles(query, pagination) {
	return await PuzzleModel.aggregate([
		{
			$match: toDbQuery(query),
		},
		{
			$facet: {
				metadata: [{ $count: "totalCount" }],
				data: [{ $skip: pagination.skip }, { $limit: pagination.limit }],
			},
		},
	]);
}
