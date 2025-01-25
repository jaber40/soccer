const express = require('express');
const cors = require('cors');
const tournamentRoutes = require('../client/src/routes/tournamentRoutes'); // Import the tournament routes
const countryRoutes = require('../client/src/routes/countryRoutes'); // Import the country routes
const app = express();
const port = 5000;
require('dotenv').config();

// Use CORS to allow React app to make requests
app.use(cors());

// Use the tournament and country routes with distinct prefixes
app.use('/api/tournaments', tournamentRoutes);  // Tournament API route (e.g., /api/tournaments)
app.use('/api/countries', countryRoutes);        // Country API route (e.g., /api/countries)

// Function to start the express server
function startServer() {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
