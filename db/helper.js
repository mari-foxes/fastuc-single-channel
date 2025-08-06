const db = require('./db');

// Add a user to the bans table
function banUser(username, callback) {
  db.run(
    'INSERT OR IGNORE INTO bans (username) VALUES (?)',
    [username],
    callback
  );
}

// Remove a user from the bans table
function unbanUser(username, callback) {
    db.run(
    'DELETE FROM bans WHERE username = ?',
    [username],
    callback
    );
}

// Check if a user is banned
function isUserBanned(username, callback) {
  db.get(
    'SELECT 1 FROM bans WHERE username = ?',
    [username],
    (err, row) => callback(err, !!row)
  );
}

// Add a rule
function addRule(keyword, response, allowed_usage_amount, ban_for, callback) {
  db.run(
    `INSERT INTO rules (keyword, response, allowed_usage_amount, ban_for)
     VALUES (?, ?, ?, ?)`,
    [keyword, response, allowed_usage_amount, ban_for ? 1 : 0],
    callback
  );
}

// Delete a rule by keyword
function deleteRule(keyword, callback) {
  db.run(
    'DELETE FROM rules WHERE keyword = ?',
    [keyword],
    callback
  );
}

// Get all rules
function getRules(callback) {
  db.all('SELECT * FROM rules', [], callback);
}

// Find a rule by keyword
function findRuleByKeyword(keyword, callback) {
  db.get(
    'SELECT * FROM rules WHERE keyword = ?',
    [keyword],
    callback
  );
}

// Add a auto-welcome message
function addWelcomeMessage(sentence, callback) {
  db.run(
    'INSERT OR IGNORE INTO messages (sentence) VALUES (?)',
    [sentence],
    callback
  );
}

// Remove a auto-welcome message
function deleteWelcomeMessage(sentence, callback) {
  db.run(
    'DELETE FROM messages WHERE sentence = ?',
    [sentence],
    callback
  );
}

// Get a random welcome message
function getRandomWelcomeMessage(callback) {
  db.get('SELECT sentence FROM messages ORDER BY RANDOM() LIMIT 1', [], callback);
}

// Get all welcome messages
function getAllWelcomeMessages(callback) {
  db.all('SELECT sentence FROM messages', [], callback);
}

module.exports = {
  banUser,
  isUserBanned,
  addRule,
  getRules,
  findRuleByKeyword,
};