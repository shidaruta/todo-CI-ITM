const db = require('../db');

const TaskModel = {
  getAllByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, rows) => {
        if (err) return reject(err);
        // Convert 'done' to 'completed' for API consistency
        const tasks = (rows || []).map(task => ({
          ...task,
          completed: task.done === 1
        }));
        resolve(tasks);
      });
    });
  },

  create: (userId, text) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO tasks (user_id, text, done) VALUES (?, ?, 0)', [userId, text], function (err) {
        if (err) return reject(err);
        db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
          if (err) return reject(err);
          resolve({
            ...row,
            completed: row.done === 1
          });
        });
      });
    });
  },

  updateText: (taskId, userId, text) => {
    return new Promise((resolve, reject) => {
      db.run('UPDATE tasks SET text = ? WHERE id = ? AND user_id = ?', [text, taskId, userId], function (err) {
        if (err) return reject(err);
        db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, row) => {
          if (err) return reject(err);
          if (!row) return resolve(null);
          resolve({
            ...row,
            completed: row.done === 1
          });
        });
      });
    });
  },

  toggleDone: (taskId) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        
        const newDone = row.done ? 0 : 1;
        db.run('UPDATE tasks SET done = ? WHERE id = ?', [newDone, taskId], function (err) {
          if (err) return reject(err);
          db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, updated) => {
            if (err) return reject(err);
            resolve({
              ...updated,
              completed: updated.done === 1
            });
          });
        });
      });
    });
  },

  delete: (taskId, userId) => {
    return new Promise((resolve, reject) => {
      // First check if task exists and belongs to user
      db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        
        db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], function (err) {
          if (err) return reject(err);
          resolve({ success: true });
        });
      });
    });
  }
};

module.exports = TaskModel;