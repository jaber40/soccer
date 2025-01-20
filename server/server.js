// src/server.js
const express = require('express');
const cors = require('cors');
const tournamentRoutes = require('../client/src/routes/tournamentRoutes'); // Import the routes
const app = express();
const port = 5000;
require('dotenv').config();

// Use CORS to allow React app to make requests
app.use(cors());

// Use the tournament routes
app.use('/api', tournamentRoutes);

// Function to start the express server
function startServer() {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
