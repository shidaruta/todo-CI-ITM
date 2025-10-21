// routes/taskRoutes.js
const express = require('express');
const auth = require('../middleware/authMiddleware');
const Task = require('../models/TaskModel');

const router = express.Router();

router.get('/', auth, (req, res) => {
  Task.getAllByUser(req.user.id, (err, tasks) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(tasks);
  });
});

router.post('/', auth, (req, res) => {
  const { text } = req.body;
  Task.create(req.user.id, text, (err, task) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(task);
  });
});

router.put('/:id', auth, (req, res) => {
  const { text } = req.body;
  Task.updateText(req.params.id, req.user.id, text, (err, task) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(task);
  });
});

router.post('/:id/toggle', auth, (req, res) => {
  Task.toggleDone(req.params.id, (err, task) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(task);
  });
});

router.delete('/:id', auth, (req, res) => {
  Task.delete(req.params.id, req.user.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

module.exports = router;
