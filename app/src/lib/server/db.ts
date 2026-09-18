// Database schema migrated 1:1 from the WinDev HFSQL analysis
// (respaldo/Refactorizando/Refactorizando.ana/Refactorizando.sql).

import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../../../data');
const DB_PATH = join(DATA_DIR, 'refactorizando.db');

mkdirSync(DATA_DIR, { recursive: true });

const dbFileExisted = existsSync(DB_PATH);

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initSchema(): void {
	db.exec(`
		CREATE TABLE IF NOT EXISTS entity (
			IDentity INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT NOT NULL,
			isActive INTEGER NOT NULL,
			document TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS entityPhones (
			IDentityPhones INTEGER PRIMARY KEY AUTOINCREMENT,
			number TEXT NOT NULL,
			isActive INTEGER NOT NULL,
			IDentity INTEGER,
			FOREIGN KEY (IDentity) REFERENCES entity (IDentity)
		);
		CREATE INDEX IF NOT EXISTS WDIDX_entityPhones_IDentity ON entityPhones (IDentity);

		CREATE TABLE IF NOT EXISTS product (
			IDproduct INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			description TEXT NOT NULL,
			price NUMERIC(24, 6) NOT NULL,
			isActive INTEGER NOT NULL
		);

		CREATE TABLE IF NOT EXISTS product_2023 (
			IDproduct_2023 INTEGER PRIMARY KEY AUTOINCREMENT
		);

		CREATE TABLE IF NOT EXISTS registros (
			IDregistros INTEGER PRIMARY KEY AUTOINCREMENT,
			dato TEXT NOT NULL
		);
	`);
}

function seedIfEmpty(): void {
	const count = db.prepare('SELECT COUNT(*) AS n FROM product').get() as { n: number };
	if (count.n > 0) return;

	db.prepare(
		`INSERT INTO product (IDproduct, name, description, price, isActive) VALUES
			(1, 'pantalla 24', '', 133, 1),
			(2, 'teclado mecánico', 'switches rojos', 89.99, 1),
			(3, 'mouse inalámbrico', '', 45.5, 0)`
	).run();
}

if (!dbFileExisted) {
	initSchema();
	seedIfEmpty();
} else {
	// Ensure schema exists even if the file was created without tables.
	initSchema();
}
