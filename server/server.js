// src/server.js
const express = require('express');
const cors = require('cors');
const basicAuth = require('express-basic-auth');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 5000;

// 🔹 Use __dirname to safely require routes
const tournamentRoutes = require(path.join(__dirname, 'routes', 'tournamentRoutes'));
const countryRoutes = require(path.join(__dirname, 'routes', 'countryRoutes'));
const playerRoutes = require(path.join(__dirname, 'routes', 'playerRoutes'));
const playerSelRoutes = require(path.join(__dirname, 'routes', 'playerSelRoutes'));

// 🔒 Conditional Basic Auth (must be before CORS)
if (process.env.ENABLE_SITE_AUTH === 'true') {
  console.log('Applying Basic Auth middleware...');
  app.use(
    basicAuth({
      users: { [process.env.SITE_USER]: process.env.SITE_PASS },
      challenge: true,
      unauthorizedResponse: 'Access denied',
    })
  );
}

// Enable CORS after auth
app.use(cors());

// API routes
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/players/selected', playerSelRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running at ${process.env.API_BASE_URL}`);
});




