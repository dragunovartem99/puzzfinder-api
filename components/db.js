import Database from "better-sqlite3";
const db = new Database("./sql/puzzfinder.db");
db.pragma("journal_mode = WAL");

export { db };
