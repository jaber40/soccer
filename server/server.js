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
  host: process.env.DB_HOST, // This should match the service name in docker-compose.yml
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
      app.get('/data', (req, res) => {
      db_connect.query('SELECT * FROM player', (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Failed to fetch data' });
      }
      console.log(results);
      res.json(results);
    });
  });
      //db_connect.end(); // Close the initial connection after checking
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

// Sample API route to fetch data from DB
    //const db_connect2 = mysql.createConnection(dbConfig);
    //app.get('/data', (req, res) => {
    //db_connect2.query('SELECT * FROM player', (err, results) => {
    //if (err) {
      //console.error('Error executing query:', err);
      //return res.status(500).json({ error: 'Failed to fetch data' });
    //}
    //console.log(results);
    //res.json(results);
  //});
//});
