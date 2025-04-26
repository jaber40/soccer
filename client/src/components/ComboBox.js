// src/components/ComboBox.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TournamentSelect = ({ onTournamentChange }) => {
  const [tournaments, setTournaments] = useState([]); // State to store tournament data
  const [selectedTournament, setSelectedTournament] = useState(''); // State for selected tournament
  const [countriesData, setCountriesData] = useState([]); // State to store countries.json data
  const [filteredCountries, setFilteredCountries] = useState([]); // State for filtered countries based on selected tournament
  const [loading, setLoading] = useState(true); // 👈 New

// Helper to handle server sleep
const handleServerSleep = () => {
  console.warn('Server likely waking up. Waiting 5 seconds before reload...');
  setTimeout(() => {
    window.location.reload();
  }, 5000);
};

// Fetch tournament data from the server
useEffect(() => {
  axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tournaments`)
    .then((response) => {
      console.log('Tournaments fetched:', response.data);

      if (!Array.isArray(response.data) || response.data.length === 0) {
        handleServerSleep();
        return;
      }

      setTournaments(response.data); // Populate the tournaments state
      setLoading(false); // Done loading
    })
    .catch((error) => {
      console.error('Error fetching tournaments:', error);
      handleServerSleep();
    });
}, []); // Empty dependency array to fetch once when the component mounts



  // Fetch countries data from countries.json (located in /public)
  useEffect(() => {
    fetch('/countries.json') // Fetch from public directory
      .then(response => response.json())
      .then(data => {
        console.log('Countries data fetched:', data); // Log countries.json data
        setCountriesData(data); // Set the countries data
      })
      .catch((error) => {
        console.error('Error fetching countries.json:', error);
      });
  }, []); // This should only run once when the component mounts

  // Handle the selection change
  const handleChange = (event) => {
    const tournamentId = event.target.value; // Get selected tournament_id
    setSelectedTournament(tournamentId); // Update local state
    console.log('Tournament selected (ID):', tournamentId);

    onTournamentChange(tournamentId); // Pass the tournament_id to the parent
  };

  // Function to filter and match countries with coordinates based on the selected tournament
  const matchCountryCoordinates = (countries) => {
    console.log('Matching countries with coordinates...');
    const matchedCountries = countries.map(country => {
      const countryData = countriesData.find(c => c.country_name === country.country_name);
      if (countryData) {
        console.log(`Matched country: ${country.country_name} - Coordinates: (${countryData.x}, ${countryData.y})`);
        return { ...country, x: countryData.x, y: countryData.y };
      } else {
        console.log(`No coordinates found for country: ${country.country_name}`);
        return country;
      }
    });
    console.log('Matched countries:', matchedCountries);
    return matchedCountries;
  };

  // Use this effect to update the filtered countries when a tournament is selected
useEffect(() => {
  if (selectedTournament) {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/countries/${selectedTournament}`)
      .then((response) => {
        const filtered = response.data;

        if (!Array.isArray(filtered) || filtered.length === 0) {
          handleServerSleep();
          return;
        }

        const matchedCountries = matchCountryCoordinates(filtered); // Match coordinates
        setFilteredCountries(matchedCountries); // Set filtered countries with coordinates
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
        handleServerSleep();
      });
  }
}, [selectedTournament, countriesData]);


  return (
<div>
  {loading ? (
    <>
      <p style={{ fontFamily: 'monospace', fontSize: '16px', color: 'white' }}>
        Loading<span className="dots"></span>
      </p>
      <div className="progress-container">
        <div className="progress-bar"></div>
      </div>
    </>
  ) : (
    <select
      id="tournament"
      value={selectedTournament || ""}
      onChange={handleChange}
    >
      <option value="" disabled>--Select a Tournament--</option>
      {tournaments.map((tournament) => (
        <option key={tournament.tournament_id} value={tournament.tournament_id}>
          {tournament.tournament_name}
        </option>
      ))}
    </select>
  )}
</div>
  );
};

export default TournamentSelect;
