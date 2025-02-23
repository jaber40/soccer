// src/components/ComboBox3.js
import React, { useState, useEffect } from 'react';

const ComboBox3 = ({ 
  selectedCountry, 
  selectedTournamentId, 
  selectedPlayer, 
  setSelectedPlayer, 
  setSelectedPlayerDetails, 
  selectedPlayerDetails, 
  players = [] // Set a default empty array if players is undefined
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only set player data if necessary and players is defined
    if (selectedCountry && selectedTournamentId && players.length) {
      setLoading(true);
      setError(null);

      // Ensure players array is not empty or undefined
      const filteredPlayers = players.filter(player => player.country_id === selectedCountry);

      setLoading(false);
    }
  }, [selectedCountry, selectedTournamentId, players]);

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
