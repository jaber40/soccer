// src/utils/dbPool.js
const mysql = require('mysql2');
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let dbPool = null;

// Singleton to manage MySQL connection pool
function getDBPool() {
  if (!dbPool) {
    dbPool = mysql.createPool(dbConfig);
  }
  return dbPool;
}

module.exports = getDBPool;
