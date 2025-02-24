// src/components/ComboBox2.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComboBox3 from './ComboBox3';

const CountrySelect = ({ 
  selectedTournamentId, 
  selectedCountry, 
  setSelectedCountry, 
  setSelectedPlayer, 
  setPlayerData, 
  setMapPoints,
  setSelectedPlayerDetails,
  selectedPlayer
}) => {
  const [countries, setCountries] = useState([]); // Store the list of countries
  const [players, setPlayers] = useState([]); // Store the list of players
  const [loading, setLoading] = useState(false); // Loading state for API requests
  const [error, setError] = useState(null); // Error state for failed API requests

  // Fetch the list of countries when the selected tournament changes
  useEffect(() => {
    if (selectedTournamentId) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/countries/${selectedTournamentId}`)
        .then((response) => {
          setCountries(response.data); // Store the list of countries
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching countries:', error);
          setError("Failed to load countries.");
          setLoading(false);
        });
    } else {
      setCountries([]); // Reset countries if no tournament is selected
    }
  }, [selectedTournamentId]);

  // Handle the change event when a country is selected
  const handleChange = (event) => {
    const countryId = event.target.value;

    // Prevent redundant updates if the country is already selected
    if (countryId === selectedCountry) return;

    setSelectedCountry(countryId); // Set the selected country
    setSelectedPlayer(""); // Reset the selected player when country changes

    // Fetch player details when a country and tournament are selected
    if (countryId && selectedTournamentId) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/players/details?countryId=${countryId}&tournamentId=${selectedTournamentId}`)
        .then((response) => {
          const playersData = response.data || [];
          setPlayers(playersData); // Store the list of players
          setPlayerData(playersData); // Update the player data in the parent component

          // Map the players' coordinates for updating the map
          const mapPoints = playersData
            .filter(player => player.player_x && player.player_y)
            .map(player => ({
              lat: parseFloat(player.player_x),
              lng: parseFloat(player.player_y),
              name: player.player_name
            }));

          setMapPoints(mapPoints); // Set the map points based on player coordinates
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching player details:', error);
          setPlayers([]); // Reset players if there's an error
          setPlayerData([]);
          setMapPoints([]);
          setError("Failed to load player details.");
          setLoading(false);
        });
    } else {
      setPlayers([]); // Reset players if no country or tournament is selected
      setPlayerData([]);
      setMapPoints([]);
    }
  };

  return (
    <div>
      <label htmlFor="country">Select Country:</label>
      <select
        id="country"
        value={selectedCountry}
        onChange={handleChange}
        disabled={loading}
      >
        <option value="">--Select a Country--</option>
        {countries.map((country) => (
          <option key={country.country_id} value={country.country_id}>
            {country.country_name}
          </option>
        ))}
      </select>

      {loading && <p>Loading countries...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {selectedCountry && selectedTournamentId && (
        <ComboBox3
          selectedCountry={selectedCountry}
          selectedTournamentId={selectedTournamentId}
          selectedPlayer={selectedPlayer} // Pass the current selectedPlayer value
          setSelectedPlayer={setSelectedPlayer} // Pass the setSelectedPlayer function
          setSelectedPlayerDetails={setSelectedPlayerDetails}
          players={players} // Pass the list of players to ComboBox3
        />
      )}
    </div>
  );
};

export default CountrySelect;
