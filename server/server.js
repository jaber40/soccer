//server.js
const express = require('express');
const cors = require('cors');

const tournamentRoutes = require('./src/routes/tournamentRoutes');
const countryRoutes = require('./src/routes/countryRoutes');
const playerRoutes = require('./src/routes/playerRoutes');
const playerSelRoutes = require('./src/routes/playerSelRoutes');
const contactRoutes = require("./src/routes/contactRoutes");

// Load env ONLY in local development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

// Use Render port if available, fallback locally
const port = process.env.PORT || 5000;

// Enable CORS + JSON
app.use(cors());
app.use(express.json());
app.set('trust proxy', 1);

// API routes
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/players/selected', playerSelRoutes);
app.use("/api/contact", contactRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});