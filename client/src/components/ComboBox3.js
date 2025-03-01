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
    setSelectedPlayer(playerId);
    const player = players.find((p) => p.player_id === parseInt(playerId));
    if (player) {
      setSelectedPlayerDetails(player);
    }
  };

  return (
    <div>
      <label htmlFor="player">Select Player:</label>
      <select id="player" value={selectedPlayer} onChange={handlePlayerChange}>
        <option value="">--Select a Player--</option>
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
