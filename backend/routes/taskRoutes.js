const express = require('express');
const Task = require('../models/TaskModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('Getting tasks for user:', req.user.id);
    const tasks = await Task.getAllByUser(req.user.id);
    res.json(tasks);
  } catch (err) {
    console.error('Get tasks error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Creating task for user:', req.user.id);
    const { text } = req.body;
    const task = await Task.create(req.user.id, text);
    res.json(task);
  } catch (err) {
    console.error('Create task error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    console.log('Updating task:', req.params.id);
    const { text } = req.body;
    const task = await Task.updateText(req.params.id, req.user.id, text);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    console.error('Update task error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/toggle', async (req, res) => {
  try {
    console.log('Toggling task:', req.params.id);
    const task = await Task.toggleDone(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    console.error('Toggle task error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting task:', req.params.id);
    const result = await Task.delete(req.params.id, req.user.id);
    if (!result) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(result);
  } catch (err) {
    console.error('Delete task error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;