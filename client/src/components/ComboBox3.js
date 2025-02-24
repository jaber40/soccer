// src/components/ComboBox3.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const ComboBox3 = ({
  selectedCountry,
  selectedTournamentId,
  selectedPlayer,
  setSelectedPlayer,
  setSelectedPlayerDetails,
}) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch players when selectedCountry or selectedTournamentId changes
  useEffect(() => {
    if (selectedCountry && selectedTournamentId) {
      setLoading(true);
      axios
        .get(
          `http://localhost:5000/api/players/details?countryId=${selectedCountry}&tournamentId=${selectedTournamentId}`
        )
        .then((response) => {
          setPlayers(response.data); // Update players list
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching players:", err);
          setPlayers([]);
          setError("Failed to load players.");
          setLoading(false);
        });
    } else {
      setPlayers([]);
    }
  }, [selectedCountry, selectedTournamentId]);

  // Handle player selection change
  const handlePlayerChange = (e) => {
    const playerId = e.target.value;
    setSelectedPlayer(playerId); // Set selected player ID
  };

  // Fetch selected player details when selectedPlayer changes
  useEffect(() => {
    if (selectedPlayer && selectedTournamentId) {
      setLoading(true);
      axios
        .get(
          `http://localhost:5000/api/players/selected/details?playerId=${selectedPlayer}&tournamentId=${selectedTournamentId}`
        )
        .then((response) => {
          setSelectedPlayerDetails(response.data); // Update player details
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching player details:", err);
          setError("Failed to load player details.");
          setLoading(false);
        });
    }
  }, [selectedPlayer, selectedTournamentId, setSelectedPlayerDetails]);

  return (
    <div>
      <select onChange={handlePlayerChange} value={selectedPlayer}>
        <option value="">Select a player</option>
        {players.map((player) => (
          <option key={player.player_id} value={player.player_id}>
            {player.player_name}
          </option>
        ))}
      </select>
      {loading && <p>Loading players...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default ComboBox3;
