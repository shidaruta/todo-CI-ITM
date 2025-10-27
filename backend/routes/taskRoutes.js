const express = require('express');
const auth = require('../middleware/authMiddleware');
const Task = require('../models/TaskModel');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.getAllByUser(req.user.id);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.create(req.user.id, text);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.updateText(req.params.id, req.user.id, text);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/toggle', auth, async (req, res) => {
  try {
    const task = await Task.toggleDone(req.params.id);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Task.delete(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;