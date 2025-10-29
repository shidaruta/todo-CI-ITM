
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'todos.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Store original methods
const originalRun = db.run.bind(db);
const originalGet = db.get.bind(db);
const originalAll = db.all.bind(db);

// Promisified versions that also support callbacks
db.run = function(sql, params = [], callback) {
  // If callback provided, use original callback-based method
  if (typeof callback === 'function') {
    return originalRun(sql, params, callback);
  }
  // Otherwise return promise
  return new Promise((resolve, reject) => {
    originalRun(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

db.get = function(sql, params = [], callback) {
  // If callback provided, use original callback-based method
  if (typeof callback === 'function') {
    return originalGet(sql, params, callback);
  }
  // Otherwise return promise
  return new Promise((resolve, reject) => {
    originalGet(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.all = function(sql, params = [], callback) {
  // If callback provided, use original callback-based method
  if (typeof callback === 'function') {
    return originalAll(sql, params, callback);
  }
  // Otherwise return promise
  return new Promise((resolve, reject) => {
    originalAll(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password_hash TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      text TEXT,
      done INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;