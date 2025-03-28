import Database from "better-sqlite3";

const database = new Database("puzzfinder.db");
database.pragma("journal_mode = WAL");

export { database };
