// server/src/dao/contactDAO.js
const getDBPool = require('../utils/dbPool');

function saveContact(name, email, message) {
  const pool = getDBPool();

  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO contact (name, email, message)
      VALUES (?, ?, ?)
    `;
    pool.query(sql, [name, email, message], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
}

module.exports = { saveContact };
