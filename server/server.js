// src/server.js
const express = require('express');
const cors = require('cors');
const tournamentRoutes = require('./src/routes/tournamentRoutes');
const countryRoutes = require('./src/routes/countryRoutes');
const playerRoutes = require('./src/routes/playerRoutes'); // Import the player routes
const app = express();
const port = 5000;
require('dotenv').config();

// Use CORS to allow React app to make requests
app.use(cors());

// Use the tournament, country, and player routes with distinct prefixes
app.use('/api/tournaments', tournamentRoutes); 
app.use('/api/countries', countryRoutes);
app.use('/api/players', playerRoutes);  // Player API route

// Start the express server
function startServer() {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
