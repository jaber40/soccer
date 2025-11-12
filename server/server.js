// src/server.js
const express = require('express');
const cors = require('cors');
const basicAuth = require('express-basic-auth'); // added for auth
const tournamentRoutes = require('./src/routes/tournamentRoutes');
const countryRoutes = require('./src/routes/countryRoutes');
const playerRoutes = require('./src/routes/playerRoutes');
const playerSelRoutes = require('./src/routes/playerSelRoutes'); // player_sel routes
require('dotenv').config();

const app = express();
const port = 5000;


// 🔒 Conditional Basic Auth
// Only enable if ENABLE_SITE_AUTH=true in environment variables
if (process.env.ENABLE_SITE_AUTH === 'true') {
  app.use(
    basicAuth({
      users: { [process.env.SITE_USER]: process.env.SITE_PASS },
      challenge: true, // triggers browser login popup
      unauthorizedResponse: 'Access denied',
    })
  );
}

// Enable CORS
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





