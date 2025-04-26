// src/components/ComboBox2.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  // Helper to handle server sleep
const handleServerSleep = () => {
  console.warn('Server likely waking up. Waiting 5 seconds before reload...');
  setTimeout(() => {
    window.location.reload();
  }, 5000);
};

  // Fetch the list of countries when the selected tournament changes
 useEffect(() => {
  if (selectedTournamentId) {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/countries/${selectedTournamentId}`)
      .then((response) => {
        if (!Array.isArray(response.data) || response.data.length === 0) {
          handleServerSleep();
          return;
        }

        setCountries(response.data); // Store the list of countries
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
        handleServerSleep();
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
    setSelectedPlayer(""); // Reset the selected player when country changes
    setSelectedCountry(countryId); // Set the selected country
    
    setSelectedPlayerDetails(null); // Reset selected player details when country changes
    setPlayerData([]);  // Reset playerData if country changes
  };

  return (
    <div>
      <select
        id="country"
        value={selectedCountry || ""}  // Ensure the select box is empty when no country is selected
        onChange={handleChange}
        disabled={loading}
      >
        <option value="" disabled>--Select a Country--</option> {/* Disabled placeholder */}
        {countries.map((country) => (
          <option key={country.country_id} value={country.country_id}>
            {country.country_name}
          </option>
        ))}
      </select>

      {loading && <p>Loading countries...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CountrySelect;
