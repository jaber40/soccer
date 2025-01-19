const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
require('dotenv').config();

// Use CORS to allow React app to make requests
app.use(cors());

// MySQL connection settings
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Function to check if MySQL is ready to accept connections
function checkMySQLReady(callback) {
  const db_connect = mysql.createConnection(dbConfig);
  db_connect.connect((err) => {
    if (err) {
      console.error('MySQL is not ready, retrying...', err);
      setTimeout(() => checkMySQLReady(callback), 5000); // Retry every 5 seconds
    } else {
      console.log('MySQL is ready!');
      callback(); // Proceed to start the server

      // Endpoint to fetch tournament names
      app.get('/tournaments', (req, res) => {
        db_connect.query('SELECT tournament_name FROM tournament', (err, results) => {
          if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Failed to fetch tournaments' });
          }
          res.json(results); // Return the tournament names
        });
      });
    }
  });
}

// Function to start the express server
function startServer() {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Start by checking if MySQL is ready
checkMySQLReady(startServer);
