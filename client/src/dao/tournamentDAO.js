// src/dao/tournamentDAO.js
const getDBPool = require('../utils/dbPool'); // A utility to handle the DB pool

// Fetch tournament names from the database
const getTournaments = (callback) => {
  const db_pool = getDBPool(); // Retrieve DB pool
  db_pool.query('SELECT * FROM tournament', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return callback(err, null);
    }
    callback(null, results); // Return the query results
  });
};

module.exports = {
  getTournaments
};
