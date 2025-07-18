import type { HttpMethod, IServer } from "../types/index.ts";
import type { Express, Request, Response } from "express";

import express from "express";
import cors from "cors";

type RequestHandler = (request: Request, response: Response) => void;

export class ExpressServer implements IServer {
	private express: Express;

	public constructor() {
		this.express = express();
		this.express.use(express.json());
		this.express.use(cors());
	}

	public listen(port: number): void {
		this.express.listen(port, () => console.log(`Puzzfinder API listening on port ${port}`));
	}

	public acceptRequest(method: HttpMethod, route: string, handler: RequestHandler): void {
		const lowerCasedMethod = method.toLowerCase();
		this.express[lowerCasedMethod](route, handler);
	}
}
