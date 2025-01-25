import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CountrySelect = ({ selectedTournamentId }) => {
  const [countries, setCountries] = useState([]); // State for country data

  // Fetch countries when selectedTournamentId changes
  useEffect(() => {
    if (selectedTournamentId) {
      console.log('Fetching countries for tournamentId:', selectedTournamentId); // Debugging log

      axios
        .get(`http://localhost:5000/api/countries/${selectedTournamentId}`)
        .then((response) => {
          console.log('Countries fetched:', response.data); // Debugging log
          setCountries(response.data); // Populate the countries state
        })
        .catch((error) => {
          console.error('Error fetching countries:', error); // Handle errors
        });
    }
  }, [selectedTournamentId]); // Re-run when selectedTournamentId changes

  return (
    <div>
      <label htmlFor="country">Select Country:</label>
      <select id="country">
        <option value="">--Select a Country--</option>
        {countries.length === 0 ? (
          <option>No countries available</option>
        ) : (
          countries.map((country, index) => (
            <option key={index} value={country.country_id}>
              {country.country_name}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default CountrySelect;
