type RequestHandler = (req: unknown, res: unknown) => void;

export interface IServer {
	listen(port: number): void;
	onRequest(method: string, path: string, handler: RequestHandler): void;
}
