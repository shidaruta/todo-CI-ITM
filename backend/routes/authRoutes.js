const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const SECRET = process.env.JWT_SECRET || 'your_secret_key';
const SALT_ROUNDS = 10;

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    if (err) return res.status(500).json({ message: 'Error hashing' });
    db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash], function (err) {
      if (err) return res.status(400).json({ message: 'Username exists' });
      const token = jwt.sign({ id: this.lastID, username }, SECRET, { expiresIn: '7d' });
      res.json({ token });
    });
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (!row) return res.status(400).json({ message: 'Invalid credentials' });
    bcrypt.compare(password, row.password_hash, (err, ok) => {
      if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: row.id, username }, SECRET, { expiresIn: '7d' });
      res.json({ token });
    });
  });
});

module.exports = router;
