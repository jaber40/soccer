const express = require('express');
const tournamentService = require('../services/tournamentService');
const router = express.Router();

// Route to get tournament names
router.get('/', (req, res) => {  // Change this to handle root path
  tournamentService.getTournaments((err, tournaments) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(tournaments); // Send the tournament names as the response
  });
});

module.exports = router;
