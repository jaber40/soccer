// src/dao/countryDAO.js
const getDBPool = require('../utils/dbPool'); // Import the utility for handling DB pool

// Fetch countries related to a given tournament ID
const getCountriesByTournament = (tournamentId, callback) => {
  const db_pool = getDBPool();

  // SQL query to fetch countries by tournament ID
  const query = `
    SELECT country_id, country_name
    FROM country
    WHERE country.country_id IN (
      SELECT tournament_country.country_id
      FROM tournament_country
      WHERE tournament_country.tournament_id = ?
    )
    ORDER BY country.country_name
  `;

  // Ensure tournamentId is valid
  if (!tournamentId || isNaN(tournamentId)) {
    const error = new Error('Invalid tournament ID');
    console.error(error.message);
    return callback(error, null);
  }

  // Execute the query
  db_pool.query(query, [tournamentId], (err, results) => {
    if (err) {
      console.error(`Error executing query for tournamentId ${tournamentId}:`, err);
      return callback(err, null);
    }

    if (!results || results.length === 0) {
      console.warn(`No countries found for tournamentId ${tournamentId}`);
      return callback(null, []); // Return an empty array if no countries found
    }

    callback(null, results); // Return the query results
  });
};

module.exports = {
  getCountriesByTournament
};
