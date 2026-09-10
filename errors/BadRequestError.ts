import { HttpError } from "./HttpError.ts";

export class BadRequestError extends HttpError {
	constructor(message: string) {
		super(400, message);
	}
}
