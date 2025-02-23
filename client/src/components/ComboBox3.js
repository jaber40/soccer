// src/components/ComboBox3.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComboBox3 = ({ selectedCountry, selectedTournamentId, selectedPlayer, setSelectedPlayer, setSelectedPlayerDetails, selectedPlayerDetails }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedCountry && selectedTournamentId) {
      setLoading(true);
      setError(null); // Reset error state on new request
      axios
        .get(`http://localhost:5000/api/players/details?countryId=${selectedCountry}&tournamentId=${selectedTournamentId}`)
        .then((response) => {
          setPlayers(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching players:', error);
          setLoading(false);
          setError('Failed to load players. Please try again later.');
        });
    }
  }, [selectedCountry, selectedTournamentId]);

  const handlePlayerSelect = (event) => {
    const playerName = event.target.value;
    const selected = players.find((player) => player.player_name === playerName);

    if (selected) {
      setSelectedPlayerDetails(selected);
      setSelectedPlayer(playerName);
    }
  };

  return (
    <div>
      <label htmlFor="player">Select Player:</label>
      <select
        id="player"
        value={selectedPlayer || ""}
        onChange={handlePlayerSelect}
        disabled={loading}
      >
        <option value="">--Select a Player--</option>
        {players.map((player) => (
          <option key={player.player_id} value={player.player_name}>
            {player.player_name}
          </option>
        ))}
      </select>

      {loading && <p>Loading players...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {selectedPlayerDetails && (
        <div>
          <h4>Selected Player: {selectedPlayerDetails.player_name}</h4>
          <p>Position: {selectedPlayerDetails.position}</p>
          <p>Age: {selectedPlayerDetails.age}</p>
          <p>Club: {selectedPlayerDetails.club_name}</p>
        </div>
      )}
    </div>
  );
};

export default ComboBox3;
