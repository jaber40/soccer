// src/server.js
const express = require('express');
const cors = require('cors');
const basicAuth = require('express-basic-auth'); 
const tournamentRoutes = require('./routes/tournamentRoutes');
const countryRoutes = require('./routes/countryRoutes');
const playerRoutes = require('./routes/playerRoutes');
const playerSelRoutes = require('./routes/playerSelRoutes');
require('dotenv').config();

const app = express();
const port = 5000;

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



