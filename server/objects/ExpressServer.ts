import type { IServer } from "../types/index.ts";
import type { Express, Request, Response } from "express";

import express from "express";
import cors from "cors";

export class ExpressServer implements IServer {
	#express: Express;

	constructor() {
		this.#express = express();
		this.#express.use(express.json());
		this.#express.use(cors());
	}

	listen(port: number): void {
		this.#express.listen(port, () => console.log(`Puzzfinder API listening on port ${port}`));
	}

	onRequest(method: string, path: string, handler: (req: Request, res: Response) => void): void {
		this.#express[method](path, handler);
	}
}
