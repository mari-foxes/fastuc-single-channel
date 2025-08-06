const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../fastuc.db');
const db = new sqlite3.Database(dbPath);

// Create bans table
db.run(`
  CREATE TABLE IF NOT EXISTS bans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE
  )
`);

// Create rules table
db.run(`
  CREATE TABLE IF NOT EXISTS rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT NOT NULL,
    response TEXT NOT NULL,
    allowed_usage_amount INTEGER NOT NULL,
    ban_for BOOLEAN NOT NULL
  )
`);

// Create autowelcome messages table
db.run(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sentence TEXT NOT NULL UNIQUE
  )
`);

module.exports = db;