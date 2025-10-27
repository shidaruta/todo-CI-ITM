const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

console.log('JWT_SECRET loaded:', SECRET ? 'YES' : 'NO (using fallback)');

// Signup
router.post('/signup', async (req, res) => {
  try {
    console.log('=== SIGNUP REQUEST ===');
    console.log('Body:', req.body);
    
    const { username, password, email } = req.body;
    
    // Validate required fields
    if (!username || !password || !email) {
      console.log('Missing fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    console.log('Looking up existing user:', username);
    const existingUser = await User.findByUsername(username);
    console.log('Existing user found:', !!existingUser);
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username exists' });
    }

    console.log('Creating new user...');
    let newUser;
    try {
      newUser = await User.create(username, password, email);
    } catch (createErr) {
      console.log('User creation error:', createErr.message);
      if (createErr.message.includes('UNIQUE constraint failed')) {
        if (createErr.message.includes('email')) {
          return res.status(400).json({ message: 'Email already exists' });
        } else if (createErr.message.includes('username')) {
          return res.status(400).json({ message: 'Username exists' });
        }
      }
      throw createErr;
    }
    console.log('User created:', newUser);

    console.log('Generating JWT token...');
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      SECRET,
      { expiresIn: '24h' }
    );
    console.log('Token generated successfully');

    res.json({ token, user: { id: newUser.id, username: newUser.username } });
  } catch (err) {
    console.error('❌ SIGNUP ERROR:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ message: err.message });
  }
});

// Login - username only
router.post('/login', async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('Body:', req.body);
    
    const { username, password } = req.body;
    
    // Validate required fields
    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    console.log('Finding user:', username);
    const user = await User.findByUsername(username);
    console.log('User found:', !!user);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Verifying password...');
    const valid = await User.verifyPassword(password, user.password_hash);
    console.log('Password valid:', valid);
    
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('Generating JWT token...');
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET,
      { expiresIn: '24h' }
    );
    console.log('Token generated successfully');

    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('❌ LOGIN ERROR:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;