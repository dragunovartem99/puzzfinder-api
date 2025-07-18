import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join("db/puzzfinder.db"), {
	fileMustExist: true,
});

db.pragma("journal_mode = WAL");

export default db;
