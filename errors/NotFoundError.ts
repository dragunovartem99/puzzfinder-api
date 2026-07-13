import { HttpError } from "./HttpError.ts";

export class NotFoundError extends HttpError {
	constructor(message: string) {
		super(404, message);
	}
}
