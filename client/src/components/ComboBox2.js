// src/components/ComboBox2.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComboBox3 from './ComboBox3'; // Import ComboBox3

const CountrySelect = ({ 
  selectedTournamentId, 
  selectedCountry, 
  setSelectedCountry, 
  setSelectedPlayer, 
  selectedPlayer, 
  setPlayerData // New prop to update the data table
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

    // Fetch player details for the data table
    if (countryId && selectedTournamentId) {
      axios.get(`http://localhost:5000/api/players/details?countryId=${countryId}&tournamentId=${selectedTournamentId}`)
        .then((response) => {
          setPlayerData(response.data); // Update player data table
        })
        .catch((error) => {
          console.error('Error fetching player details:', error);
          setPlayerData([]); // Clear table on error
        });
    } else {
      setPlayerData([]); // Clear table if no valid selection
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

      {/* Conditionally render ComboBox3 */}
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
