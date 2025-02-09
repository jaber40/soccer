// src/components/ComboBox3.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ComboBox3 = ({ selectedCountry, selectedTournamentId, selectedPlayer, setSelectedPlayer }) => {
  const [players, setPlayers] = useState([]); // State to store player data

  // Fetch players when country or tournament changes
  useEffect(() => {
    if (selectedCountry && selectedTournamentId) {
      axios
        .get(`http://localhost:5000/api/players/details?countryId=${selectedCountry}&tournamentId=${selectedTournamentId}`)
        .then((response) => {
          setPlayers(response.data); // Populate the players state
        })
        .catch((error) => {
          console.error('Error fetching players:', error);
        });
    }
  }, [selectedCountry, selectedTournamentId]);

  // Handle player selection change
  const handleChange = (event) => {
    setSelectedPlayer(event.target.value); // Update selected player
  };

  return (
    <div>
      <label htmlFor="player">Select Player:</label>
      <select
        id="player"
        value={selectedPlayer || ""}
        onChange={handleChange}
      >
        <option value="">--Select a Player--</option>
        {players.map((player) => (
          <option key={player.player_id} value={player.player_name}>
            {player.player_name}
          </option>
        ))}
      </select>

      {/* Display the selected player's name */}
      {selectedPlayer && (
        <div>
          <p>Selected Player: {selectedPlayer}</p>
        </div>
      )}
    </div>
  );
};

export default ComboBox3;
