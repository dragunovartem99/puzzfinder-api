import Database from "better-sqlite3";
const db = new Database("puzzfinder.db");
db.pragma("journal_mode = WAL");

export { db };
