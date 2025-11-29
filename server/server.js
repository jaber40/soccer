// src/server.js
const express = require('express');
const cors = require('cors');
const tournamentRoutes = require('./src/routes/tournamentRoutes');
const countryRoutes = require('./src/routes/countryRoutes');
const playerRoutes = require('./src/routes/playerRoutes');
const playerSelRoutes = require('./src/routes/playerSelRoutes'); // player_sel routes
require('dotenv').config();

const app = express();
const port = 5000;

const contactRoutes = require("./src/routes/contactRoutes");

// Enable CORS
app.use(cors());

// API routes
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/players/selected', playerSelRoutes);

app.use("/api/contact", contactRoutes);

// Start server
function startServer() {
  app.listen(port, () => {
    console.log(`Server running at ${process.env.API_BASE_URL}`);
  });
}

startServer();

