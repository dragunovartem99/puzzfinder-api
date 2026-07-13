import { readFileSync } from "node:fs";

import { parse } from "yaml";

type JsonObject = Record<string, unknown>;

type PathParameter = {
	name: string;
	in: string;
	required?: boolean;
	schema: unknown;
};

type Operation = {
	requestBody?: { content: { "application/json": { schema: unknown } } };
	parameters?: PathParameter[];
};

export const apiDocument = parse(
	readFileSync(new URL("../openapi.yaml", import.meta.url), "utf8")
) as JsonObject;

function resolveRef(ref: string): unknown {
	let node: unknown = apiDocument;
	for (const segment of ref.slice("#/".length).split("/")) {
		node = (node as JsonObject)[segment];
		if (node === undefined) throw new Error(`Unresolvable $ref in openapi.yaml: ${ref}`);
	}
	return node;
}

// Inlines every $ref so Fastify's validator receives plain JSON Schema.
// Assumes the document has no circular references.
function deref(node: unknown): unknown {
	if (Array.isArray(node)) return node.map((item) => deref(item));
	if (node === null || typeof node !== "object") return node;

	const record = node as JsonObject;
	if (typeof record.$ref === "string") return deref(resolveRef(record.$ref));

	return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, deref(value)]));
}

function getOperation(path: string, method: string): Operation {
	const paths = apiDocument.paths as Record<string, Record<string, Operation>>;
	const operation = paths[path]?.[method];
	if (!operation) {
		throw new Error(`Operation not found in openapi.yaml: ${method.toUpperCase()} ${path}`);
	}
	return operation;
}

export function bodySchema(path: string, method: string): unknown {
	const body = getOperation(path, method).requestBody;
	if (!body) throw new Error(`No request body in openapi.yaml: ${method.toUpperCase()} ${path}`);
	return deref(body.content["application/json"].schema);
}

export function paramsSchema(path: string, method: string): unknown {
	const parameters = (getOperation(path, method).parameters ?? []).filter((p) => p.in === "path");
	return {
		type: "object",
		required: parameters.filter((p) => p.required).map((p) => p.name),
		properties: Object.fromEntries(parameters.map((p) => [p.name, deref(p.schema)])),
	};
}

export function componentEnum(name: string): string[] {
	const schemas = (apiDocument.components as JsonObject).schemas as JsonObject;
	const schema = deref(schemas[name]) as { enum?: string[] } | undefined;
	if (!schema?.enum) throw new Error(`No enum component in openapi.yaml: ${name}`);
	return schema.enum;
}
