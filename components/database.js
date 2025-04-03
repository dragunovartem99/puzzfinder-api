import Database from "better-sqlite3";

const database = new Database("db/puzzfinder.db");
database.pragma("journal_mode = WAL");

export { database };
