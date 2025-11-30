// server/src/dao/contactDAO.js
const getDBPool = require('../utils/dbPool');

async function saveContact(name, email, message, retries = 12, delay = 5000) {
  const pool = getDBPool();

  for (let i = 0; i < retries; i++) {
    try {
      return await new Promise((resolve, reject) => {
        const sql = `INSERT INTO contact (name, email, message) VALUES (?, ?, ?)`;
        pool.query(sql, [name, email, message], (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        });
      });
    } catch (err) {
      console.warn(`DB not ready for contact form, retrying in ${delay}ms... (${i + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw new Error('Unable to save contact after multiple retries');
}

module.exports = { saveContact };
