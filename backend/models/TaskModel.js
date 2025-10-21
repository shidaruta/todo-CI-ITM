const db = require('../db');

const TaskModel = {
  getAllByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  create: (userId, text) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO tasks (user_id, text, done) VALUES (?, ?, 0)', [userId, text], function (err) {
        if (err) return reject(err);
        db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (_, row) => resolve(row));
      });
    });
  },

  updateText: (taskId, userId, text) => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE tasks SET text = ? WHERE id = ? AND user_id = ?', [text, taskId, userId], function (err) {
        if (err) return reject(err);
        db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (_, row) => resolve(row));
      });
    });
  },

  toggleDone: (taskId) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, row) => {
        if (err) return reject(err);
        const newDone = row.done ? 0 : 1;
        db.run('UPDATE tasks SET done = ? WHERE id = ?', [newDone, taskId], function (err) {
          if (err) return reject(err);
          db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (_, updated) => resolve(updated));
        });
      });
    });
  },

  delete: (taskId, userId) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], function (err) {
        if (err) return reject(err);
        resolve({ success: true });
      });
    });
  }
};

module.exports = TaskModel;
