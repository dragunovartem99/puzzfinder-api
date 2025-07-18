type RequestHandler = (request: unknown, response: unknown) => void;

export type HttpMethod =
	| "GET"
	| "POST"
	| "PUT"
	| "DELETE"
	| "PATCH"
	| "HEAD"
	| "OPTIONS"
	| "TRACE"
	| "CONNECT";

export interface IServer {
	listen(port: number): void;
	acceptRequest(method: HttpMethod, route: string, handler: RequestHandler): void;
}
