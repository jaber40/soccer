// src/components/ComboBox2.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComboBox3 from './ComboBox3';

const CountrySelect = ({ 
  selectedTournamentId, 
  selectedCountry, 
  setSelectedCountry, 
  selectedPlayer, 
  setSelectedPlayer, 
  setPlayerData, 
  setMapPoints,
  setSelectedPlayerDetails
}) => {
  const [countries, setCountries] = useState([]);
  const [players, setPlayers] = useState([]); // State for players data

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

    // Prevent redundant updates
    if (countryId === selectedCountry) return; 

    setSelectedCountry(countryId);
    setSelectedPlayer(""); // Reset player selection

    if (countryId && selectedTournamentId) {
      axios.get(`http://localhost:5000/api/players/details?countryId=${countryId}&tournamentId=${selectedTournamentId}`)
        .then((response) => {
          const playersData = response.data || []; // Default to empty array if no data
          setPlayers(playersData); // Set the players locally
          setPlayerData(playersData); // Update parent component
          
          const mapPoints = playersData
            .filter(player => player.player_x && player.player_y)
            .map(player => ({
              lat: parseFloat(player.player_x),
              lng: parseFloat(player.player_y),
              name: player.player_name
            }));
          
          setMapPoints(mapPoints);
        })
        .catch((error) => {
          console.error('Error fetching player details:', error);
          setPlayers([]); // Reset players if there's an error
          setPlayerData([]);
          setMapPoints([]);
        });
    } else {
      setPlayers([]); // Reset players when there's no country or tournament
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
          setSelectedPlayerDetails={setSelectedPlayerDetails}
          players={players} // Pass players as a prop
        />
      )}
    </div>
  );
};

export default CountrySelect;
