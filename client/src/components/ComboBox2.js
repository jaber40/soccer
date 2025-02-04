// src/components/ComboBox2.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComboBox3 from './ComboBox3'; // Import ComboBox3

const CountrySelect = ({ selectedTournamentId, selectedCountry, setSelectedCountry, setSelectedPlayer, selectedPlayer }) => {
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
    setSelectedCountry(event.target.value);
    setSelectedPlayer(""); // Reset player selection
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
          selectedPlayer={selectedPlayer}  // Pass selectedPlayer
          setSelectedPlayer={setSelectedPlayer} // Pass setSelectedPlayer to ComboBox3
        />
      )}
    </div>
  );
};

export default CountrySelect;
