// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import TournamentSelect from "./components/ComboBox";
import CountrySelect from "./components/ComboBox2";
import DataTable from "./components/DataTable";
import MapComponent from './components/MapComponent';
import ComboBox3 from './components/ComboBox3';

function App() {
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [playerData, setPlayerData] = useState([]);
  const [mapPoints, setMapPoints] = useState([]);
  const [mapView, setMapView] = useState("club");
  const [selectedPlayerDetails, setSelectedPlayerDetails] = useState(null);
  const [countries, setCountries] = useState([]);
  const [matchedCountries, setMatchedCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [players, setPlayers] = useState([]);
  const [countriesData, setCountriesData] = useState([]); // State for countries.json data

  // Fetch countries.json from the public folder
  useEffect(() => {
    fetch('/countries.json') // Fetch from the public directory
      .then((response) => response.json())
      .then((data) => {
        console.log('Countries data fetched:', data);  // Log countries.json data
        setCountriesData(data); // Set countries data from JSON
      })
      .catch((error) => {
        console.error('Error fetching countries.json:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedTournamentId) {
      setLoading(true);
      fetch(`http://localhost:5000/api/countries/${selectedTournamentId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Countries fetched for tournament:', data);  // Log countries data
          setCountries(data);
          const matchedCountries = matchCountryCoordinates(data); // Match countries with coordinates
          setMatchedCountries(matchedCountries);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching countries:", error);
          setCountries([]);
          setMatchedCountries([]); // Reset matched countries on error
          setError("Failed to load countries.");
          setLoading(false);
        });
    } else {
      setCountries([]);
      setMatchedCountries([]);
    }
  }, [selectedTournamentId, countriesData]);

// Function to match countries with coordinates from countries.json
const matchCountryCoordinates = (countries) => {
  const matched = countries.map((country) => {
    const countryData = countriesData.find((c) => c.country_name === country.country_name);
    const result = countryData
      ? { 
          ...country, 
          x: Number(countryData.x),  
          y: Number(countryData.y)   
        } 
      : country;

    console.log("Matching country:", country.country_name, "=>", result); // Debugging log
    return result;
  });

  console.log("Final matched countries:", matched); // Log the full result
  return matched;
};

  useEffect(() => {
    if (selectedCountry && selectedTournamentId) {
      setLoading(true);
      fetch(`http://localhost:5000/api/players/details?countryId=${selectedCountry}&tournamentId=${selectedTournamentId}`)
        .then((response) => response.json())
        .then((data) => {
          setPlayers(data);
          setPlayerData(data);
          const points = data
            .filter((player) => player.player_x && player.player_y)
            .map((player) => ({
              player_id: player.player_id,
              lat: mapView === "birthplace" ? player.player_x : player.club_x,
              lng: mapView === "birthplace" ? player.player_y : player.club_y,
              club: player.club_name,
              league: player.league_name,
              birthplace: player.player_city_name,
              birth_country: player.country_name,
              name: player.player_name,
            }));
          setMapPoints(points);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching player details:", error);
          setPlayers([]);
          setMapPoints([]);
          setError("Failed to load player details.");
          setLoading(false);
        });
    } else {
      setPlayers([]);
      setMapPoints([]);
      if (!selectedCountry || !selectedTournamentId) {
        setPlayerData([]);
      }
    }
  }, [selectedCountry, selectedTournamentId, mapView]);

  const handleTournamentChange = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setSelectedCountry("");
    setSelectedPlayer("");
    setPlayerData([]);
    setMapPoints([]);
    setError("");
    setPlayers([]);
  };

  const handlePlayerChange = (playerId) => {
    setSelectedPlayer(playerId);
    console.log('Selected Player ID:', playerId);
  };

  const handleMapViewChange = (event) => {
    setMapView(event.target.value);
  };

  useEffect(() => {
    if (selectedPlayer && selectedTournamentId) {
      fetch(`http://localhost:5000/api/players/selected/details?playerId=${selectedPlayer}&tournamentId=${selectedTournamentId}`)
        .then((response) => response.json())
        .then((data) => {
          setSelectedPlayerDetails(data);
        })
        .catch((error) => {
          console.error("Error fetching selected player details:", error);
          setSelectedPlayerDetails(null);
        });
    } else {
      setSelectedPlayerDetails(null);
    }
  }, [selectedPlayer, selectedTournamentId]);

  console.log("Props sent to MapComponent:", { mapPoints, matchedCountries });
  
  return (
    <div className="App">
      <h3>International Soccer</h3>

      <TournamentSelect
        onTournamentChange={handleTournamentChange}
        setMatchedCountries={setMatchedCountries}
      />


      {selectedTournamentId && (
        <CountrySelect
          selectedTournamentId={selectedTournamentId}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          countries={countries}
          setSelectedPlayer={setSelectedPlayer}
          setPlayerData={setPlayerData}
          setMapPoints={setMapPoints}
          setSelectedPlayerDetails={setSelectedPlayerDetails}
        />
      )}

      {selectedCountry && selectedTournamentId && (
        <ComboBox3
          onPlayerChange={handlePlayerChange}
          selectedCountry={selectedCountry}
          selectedTournamentId={selectedTournamentId}
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
          players={players}
          setSelectedPlayerDetails={setSelectedPlayerDetails}
          selectedPlayerDetails={selectedPlayerDetails}
        />
      )}

      <div>
        <label>
          <input
            type="radio"
            name="mapView"
            value="club"
            checked={mapView === "club"}
            onChange={handleMapViewChange}
          />
          Club
        </label>
        <label>
          <input
            type="radio"
            name="mapView"
            value="birthplace"
            checked={mapView === "birthplace"}
            onChange={handleMapViewChange}
          />
          Birthplace
        </label>
      </div>

      {selectedPlayerDetails && (
        <div>
          <p>Selected Player: {selectedPlayerDetails.player_name}</p>
          <p>Position: {selectedPlayerDetails.position}</p>
          <p>Age: {selectedPlayerDetails.age}</p>
          <p>Club: {selectedPlayerDetails.club_name}</p>
        </div>
      )}

      <MapComponent mapPoints={mapPoints} selectedPlayerId={selectedPlayer} popupMode={mapView} matchedCountries={matchedCountries} />

      {playerData.length > 0 && <DataTable playerData={playerData} />}
    </div>
  );
}

export default App;
