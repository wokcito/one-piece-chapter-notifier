import fs from "node:fs";
import path from "node:path";
import sqlite from "better-sqlite3";
import { DATABASE_TABLES } from "./constants";

const DATABASE_PATH = path.join(__dirname, "../../database/database.db");

export class Database {
	static #instance: sqlite.Database | null = null;

	private constructor() {}

	public static get instance(): sqlite.Database {
		if (!this.#instance) {
			const database = new sqlite(DATABASE_PATH);
			database.pragma("journal_mode = WAL");
			database.pragma("synchronous = FULL");

			DATABASE_TABLES.forEach((table) => {
				database.prepare(table).run();
			});

			this.#instance = database;
		}

		return this.#instance;
	}
}
