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

export const DB_PATH = requireString("DB_PATH");
export const CACHE_DB_PATH = requireString("CACHE_DB_PATH");
export const PORT = requireNumber("PORT");
export const ALLOWED_ORIGIN = requireString("ALLOWED_ORIGIN");
