const express = require('express');
const db = require('../db');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', auth, (req, res) => {
  db.all('SELECT * FROM tasks WHERE user_id = ?', [req.user.id], (err, rows) => res.json(rows));
});

router.post('/', auth, (req, res) => {
  const { text } = req.body;
  db.run('INSERT INTO tasks (user_id, text, done) VALUES (?, ?, 0)', [req.user.id, text], function () {
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (_, row) => res.json(row));
  });
});

router.put('/:id', auth, (req, res) => {
  const { text } = req.body;
  db.run('UPDATE tasks SET text = ? WHERE id = ? AND user_id = ?', [text, req.params.id, req.user.id], function () {
    db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (_, row) => res.json(row));
  });
});

router.post('/:id/toggle', auth, (req, res) => {
  db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, row) => {
    const newDone = row.done ? 0 : 1;
    db.run('UPDATE tasks SET done = ? WHERE id = ?', [newDone, req.params.id], function () {
      db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (_, updated) => res.json(updated));
    });
  });
});

router.delete('/:id', auth, (req, res) => {
  db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function () {
    res.json({ success: true });
  });
});

module.exports = router;
