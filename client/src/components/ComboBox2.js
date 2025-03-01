// src/components/ComboBox2.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ComboBox3 from './ComboBox3';

const CountrySelect = ({ 
  selectedTournamentId, 
  selectedCountry, 
  setSelectedCountry, 
  setSelectedPlayer, 
  setSelectedPlayerDetails, // Pass setSelectedPlayerDetails from App.js
  selectedPlayer,
  setPlayerData
}) => {
  const [countries, setCountries] = useState([]); // Store the list of countries
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
    setSelectedPlayerDetails(null); // Reset selected player details when country changes
    setPlayerData([]);  // Reset playerData if country changes
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
          setSelectedPlayerDetails={setSelectedPlayerDetails} // Pass the setter from App.js
        />
      )}
    </div>
  );
};

export default CountrySelect;
