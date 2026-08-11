-- Cloudflare D1 schema for user accounts + learning progress.
-- Apply with: npx wrangler d1 execute <DB_NAME> --file=db/schema.sql

CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY,                 -- uuid, generated at first login
	google_sub TEXT UNIQUE NOT NULL,     -- Google account's stable "sub" id
	email TEXT NOT NULL,
	name TEXT,
	avatar_url TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
	token TEXT PRIMARY KEY,              -- random session token, stored in an HttpOnly cookie
	user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	expires_at TEXT NOT NULL
);

-- One row per learning unit (e.g. "separable-equation", "laplace-transform-1").
-- Mirrors the "learning map" stations idea: each unit the student has touched.
CREATE TABLE IF NOT EXISTS unit_progress (
	user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	unit_id TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress' | 'completed'
	steps_completed INTEGER NOT NULL DEFAULT 0,
	steps_total INTEGER NOT NULL DEFAULT 0,
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),
	PRIMARY KEY (user_id, unit_id)
);

-- One row per graded attempt (quiz answer or solver step), for review /
-- analytics and to compute streaks or accuracy per unit.
CREATE TABLE IF NOT EXISTS attempts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	unit_id TEXT NOT NULL,
	item_id TEXT NOT NULL,               -- which exercise / step within the unit
	is_correct INTEGER NOT NULL,         -- 0 or 1
	submitted_value TEXT,                -- what the student typed, for review
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_attempts_user_unit ON attempts(user_id, unit_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
