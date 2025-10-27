const db = require('../db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;


const UserModel = {
  create: async (username, password, email) => {
    return new Promise(async (resolve, reject) => {
      try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        
        db.run(
          'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
          [username, email, hash],
          function (err) {
            if (err) return reject(err);
            resolve({ id: this.lastID, username, email });
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  },

  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  verifyPassword: (password, hash) => {
    return bcrypt.compare(password, hash);
  }
};

module.exports = UserModel;