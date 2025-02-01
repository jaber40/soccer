import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CountrySelect = ({ selectedTournamentId, selectedCountry, setSelectedCountry }) => {
  const [countries, setCountries] = useState([]); // State to store country data

  // Fetch countries based on the selected tournament
  useEffect(() => {
    if (selectedTournamentId) {
      axios.get(`http://localhost:5000/api/countries/${selectedTournamentId}`)
        .then((response) => {
          setCountries(response.data); // Populate the countries state
        })
        .catch((error) => {
          console.error('Error fetching countries:', error);
        });
    } else {
      setCountries([]); // Reset countries when tournament changes
    }
  }, [selectedTournamentId]);

  // Handle country selection change
  const handleChange = (event) => {
    setSelectedCountry(event.target.value); // Update selected country
  };

  return (
    <div>
      <label htmlFor="country">Select Country:</label>
      <select
        id="country"
        value={selectedCountry} // Bind selected value
        onChange={handleChange}
      >
        <option value="">--Select a Country--</option>
        {countries.map((country) => (
          <option key={country.country_id} value={country.country_id}>
            {country.country_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelect;
