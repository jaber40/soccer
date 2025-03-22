// src/components/ComboBox3.js
import React from 'react';

const ComboBox3 = ({
  selectedCountry,
  selectedTournamentId,
  selectedPlayer,
  setSelectedPlayer,
  players = [], // Default to an empty array if players is undefined
  setSelectedPlayerDetails,
  selectedPlayerDetails,
}) => {

  const handlePlayerChange = (event) => {
    const playerId = event.target.value;
    setSelectedPlayer(playerId);  // Set the selected player ID
    const player = players.find((p) => p.player_id === parseInt(playerId));
    if (player) {
      setSelectedPlayerDetails(player);  // Set player details for further use
    }
  };

  return (
    <div>
      <label htmlFor="player">Select Player:</label>
      <select
        id="player"
        value={selectedPlayer || ""}  // Ensure the select box is empty when no player is selected
        onChange={handlePlayerChange}
      >
        <option value="" disabled>--Select a Player--</option>  {/* Disabled option as placeholder */}
        {players.map((player) => (
          <option key={player.player_id} value={player.player_id}>
            {player.player_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ComboBox3;
