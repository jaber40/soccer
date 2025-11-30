//server/src/dao/contactDOA.js
const pool = require('../utils/dbPool');

async function saveContact(name, email, message) {
  const sql = `
    INSERT INTO contact (name, email, message)
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.query(sql, [name, email, message]);
  return result.insertId;
}

module.exports = {
  saveContact
};