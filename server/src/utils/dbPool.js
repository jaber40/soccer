// src/utils/dbPool.js
const mysql = require("mysql2");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 4000,
  ssl: {
    rejectUnauthorized: true
  }
};

let dbPool = null;
let keepAliveStarted = false;

// Singleton to manage MySQL connection pool
function getDBPool() {
  if (!dbPool) {
    dbPool = mysql.createPool(dbConfig);
    startDbKeepAlive(dbPool);
  }
  return dbPool;
}

function startDbKeepAlive(pool) {
  if (keepAliveStarted) return;

  const enabled = process.env.DB_KEEPALIVE_ENABLED === "true";
  if (!enabled) {
    console.log("DB keep-alive disabled");
    return;
  }

  keepAliveStarted = true;

  const intervalMinutes =
    Number(process.env.DB_KEEPALIVE_INTERVAL_MINUTES) || 8;
  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(`DB keep-alive enabled (every ${intervalMinutes} minutes)`);

  setInterval(() => {
    pool.query("SELECT 1", (err) => {
      if (err) {
        console.error("DB keep-alive ping failed:", err.message);
      } else if (process.env.NODE_ENV !== "production") {
        console.log("DB keep-alive ping successful");
      }
    });
  }, intervalMs);
}

module.exports = getDBPool;
