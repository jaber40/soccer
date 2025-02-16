//src/components/ComboBox2.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComboBox3 from './ComboBox3';

const CountrySelect = ({ 
  selectedTournamentId, 
  selectedCountry, 
  setSelectedCountry, 
  setSelectedPlayer, 
  selectedPlayer, 
  setPlayerData,
  setMapPoints // New prop to update the Leaflet map
}) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (selectedTournamentId) {
      axios.get(`http://localhost:5000/api/countries/${selectedTournamentId}`)
        .then((response) => {
          setCountries(response.data);
        })
        .catch((error) => {
          console.error('Error fetching countries:', error);
        });
    } else {
      setCountries([]);
    }
  }, [selectedTournamentId]);

  const handleChange = (event) => {
    const countryId = event.target.value;
    setSelectedCountry(countryId);
    setSelectedPlayer(""); // Reset player selection

    if (countryId && selectedTournamentId) {
      axios.get(`http://localhost:5000/api/players/details?countryId=${countryId}&tournamentId=${selectedTournamentId}`)
        .then((response) => {
          const players = response.data;
          setPlayerData(players); // Update player data table

          // Extract player_x and player_y coordinates for the map
          const mapPoints = players
            .filter(player => player.player_x && player.player_y) // Ensure coordinates exist
            .map(player => ({
              lat: parseFloat(player.player_x),
              lng: parseFloat(player.player_y),
              name: player.player_name
            }));

          setMapPoints(mapPoints); // Update the map
        })
        .catch((error) => {
          console.error('Error fetching player details:', error);
          setPlayerData([]);
          setMapPoints([]); // Clear map if error
        });
    } else {
      setPlayerData([]);
      setMapPoints([]); // Clear map if no valid selection
    }
  };

  return (
    <div>
      <label htmlFor="country">Select Country:</label>
      <select
        id="country"
        value={selectedCountry}
        onChange={handleChange}
      >
        <option value="">--Select a Country--</option>
        {countries.map((country) => (
          <option key={country.country_id} value={country.country_id}>
            {country.country_name}
          </option>
        ))}
      </select>

      {selectedCountry && selectedTournamentId && (
        <ComboBox3
          selectedCountry={selectedCountry}
          selectedTournamentId={selectedTournamentId}
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
        />
      )}
    </div>
  );
};

export default CountrySelect;
