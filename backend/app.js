// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', authRoutes);
app.use('/api/tasks',authMiddleware, taskRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is working' });
});

module.exports = app;
