const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const router = express.Router();
const SECRET = process.env.JWT_SECRET;

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findByUsername(username);
    if (existingUser) return res.status(400).json({ message: 'Username exists' });

    const newUser = await User.create(username, password, email);
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const valid = await User.verifyPassword(password, user.password_hash);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
