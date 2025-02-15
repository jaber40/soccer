// src/dao/tournamentDAO.js
const getDBPool = require('../utils/dbPool'); // A utility to handle the DB pool

// Fetch tournament IDs and names from the database
const getTournaments = (callback) => {
  const db_pool = getDBPool(); // Retrieve DB pool

  // Explicitly select only the necessary columns
  const query = 'SELECT tournament_id, tournament_name FROM tournament';

  db_pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return callback(err, null); // Return error in callback
    }

    if (!results || results.length === 0) {
      console.warn('No tournaments found in the database');
      return callback(null, []); // Return an empty array if no data
    }

    callback(null, results); // Return the query results
  });
};

module.exports = {
  getTournaments
};
