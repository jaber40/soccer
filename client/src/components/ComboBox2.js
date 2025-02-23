//src/components/ComboBox2.js
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
    setSelectedPlayer(""); 

    if (countryId && selectedTournamentId) {
      axios.get(`http://localhost:5000/api/players/details?countryId=${countryId}&tournamentId=${selectedTournamentId}`)
        .then((response) => {
          const players = response.data;
          setPlayerData(players);

          const mapPoints = players
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
          setPlayerData([]);
          setMapPoints([]);
        });
    } else {
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
        />
      )}
    </div>
  );
};

export default CountrySelect;
