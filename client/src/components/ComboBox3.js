// src/components/ComboBox3.js
import React, { useState, useEffect } from 'react';

const ComboBox3 = ({
  selectedCountry,
  selectedTournamentId,
  selectedPlayer,
  setSelectedPlayer,
  setSelectedPlayerDetails,
  selectedPlayerDetails,
}) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedCountry && selectedTournamentId) {
      setLoading(true);
      fetch(`http://localhost:5000/api/players/details?countryId=${selectedCountry}&tournamentId=${selectedTournamentId}`)
        .then((response) => response.json())
        .then((data) => {
          setPlayers(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching player details:", error);
          setPlayers([]);
          setError("Failed to load players.");
          setLoading(false);
        });
    } else {
      setPlayers([]);
    }
  }, [selectedCountry, selectedTournamentId]);

  // Handle player selection change
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

      {loading && <p>Loading players...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {selectedPlayerDetails && (
        <div>
          <h4>Selected Player: {selectedPlayerDetails.player_name}</h4>
          <p>Position: {selectedPlayerDetails.position}</p>
          <p>Age: {selectedPlayerDetails.age}</p>
        </div>
      )}
    </div>
  );
};

export default ComboBox3;

