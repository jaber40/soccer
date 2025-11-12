// src/server.js
const express = require('express');
const cors = require('cors');
const basicAuth = require('express-basic-auth'); // added for auth
const tournamentRoutes = require('./routes/tournamentRoutes');
const countryRoutes = require('./routes/countryRoutes');
const playerRoutes = require('./routes/playerRoutes');
const playerSelRoutes = require('./routes/playerSelRoutes'); // player_sel routes
require('dotenv').config();

const app = express();
const port = 5000;

// 🔒 Conditional Basic Auth
// Only enable if ENABLE_SITE_AUTH=true in environment variables
if (process.env.ENABLE_SITE_AUTH === 'true') {
  console.log('Applying Basic Auth middleware...');
  app.use(
    basicAuth({
      users: { [process.env.SITE_USER]: process.env.SITE_PASS },
      challenge: true, // triggers browser login popup
      unauthorizedResponse: 'Access denied',
    })
  );
}

// Enable CORS after Basic Auth
app.use(cors());

// API routes
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/players/selected', playerSelRoutes);

// Start server
function startServer() {
  app.listen(port, () => {
    console.log(`Server running at ${process.env.API_BASE_URL}`);
  });
}

startServer();


