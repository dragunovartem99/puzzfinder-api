function requireString(key: string): string {
	const value = process.env[key];
	if (!value) throw new Error(`Missing required environment variable: ${key}`);
	return value;
}

function requireNumber(key: string): number {
	const value = Number(requireString(key));
	if (!Number.isFinite(value)) throw new Error(`Environment variable ${key} must be a number`);
	return value;
}

function optionalString(key: string): string | undefined {
	return process.env[key] || undefined;
}

export const DB_PATH = requireString("DB_PATH");
export const PORT = requireNumber("PORT");
export const ALLOWED_ORIGIN = requireString("ALLOWED_ORIGIN");
// DuckDB defaults to 80% of RAM and all cores; cap them on a shared host.
export const DUCKDB_MEMORY_LIMIT = optionalString("DUCKDB_MEMORY_LIMIT");
export const DUCKDB_THREADS = optionalString("DUCKDB_THREADS");
