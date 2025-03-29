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
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

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
  const countryMap = Object.fromEntries(countriesData.map(c => [c.country_name, c]));
  return countries.map(country => ({
    ...country,
    ...(countryMap[country.country_name] ? { x: Number(countryMap[country.country_name].x), y: Number(countryMap[country.country_name].y) } : {})
  }));
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
              image: player.image_url,
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

const handleSelectPlayer = (playerId) => {
  selectPlayer(playerId)
};

// Move the handleMarkerClick function outside of handleSelectPlayer
const handleMarkerClick = (playerId) => {
  selectPlayer(playerId)
};

const handlePlayerChange = (playerId) => {
  selectPlayer(playerId)
};

const selectPlayer = (playerId) => {
  console.log("Selected player:", playerId);
  setSelectedPlayer(playerId);
  
  const player = players.find(p => p.player_id === parseInt(playerId));
  setSelectedPlayerDetails(player || null);
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
  }, [selectedPlayerId, selectedTournamentId]);

  console.log("Props sent to MapComponent:", { mapPoints, matchedCountries });
  
 return (
  <div className="App">
    {/* Left-side container for Map and Data Table */}
    <div className="map-data-container">
      <MapComponent
        mapPoints={mapPoints}
        selectedPlayerId={selectedPlayer}
        popupMode={mapView}
        matchedCountries={matchedCountries}
        setSelectedPlayer={setSelectedPlayer}
        setSelectedPlayerDetails={setSelectedPlayerDetails}
        players={players}
      />
      {playerData.length > 0 && (
        <DataTable
          playerData={playerData}
          setSelectedPlayer={setSelectedPlayer}
          setSelectedPlayerDetails={setSelectedPlayerDetails}
          players={players}
          selectedPlayer={selectedPlayer}
        />
      )}
    </div>

    {/* Right-side container for the rest of the components */}
    <div className="right-side-container">
      {/* Title and Tournament Image */}
      <h3 style={{ color: "white" }}>International Soccer</h3>
      <img
        src={`images/tournaments/${selectedTournamentId}.jpg`}
        style={{ width: "120px", height: "80px", objectFit: "contain" }}
        onError={(e) => {
          e.target.src = "images/soccer.jpg";
        }}
      />

      {/* Map View Radio Buttons */}
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

      {/* TournamentSelect */}
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
        <div>
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
          <img 
            src={`images/countries/${selectedCountry}.png`} 
            width="30" 
            height="20" 
            style={{ margin: "5px" }} 
          />
        </div>
      )}

      {selectedPlayerDetails && (
        <div>
          <img
            src={`images/players/${selectedPlayerDetails.player_id}.jpg`}
            alt={selectedPlayerDetails.player_name}
            width="120"
            height="180"
          /><br />
          <img src={`images/clubs/${selectedPlayerDetails.club_id}.jpg`} width="60" height="60" />
          <img src={`images/leagues/${selectedPlayerDetails.league_id}.jpg`} width="60" height="60" />
          <div style={{ fontSize: "0.9rem", lineHeight: "1.2", color: "#fff" }}>
          <div>{selectedPlayerDetails.player_name}</div>
          <div>{selectedPlayerDetails.player_city_name}, {selectedPlayerDetails.country_name}</div>
          <div>{selectedPlayerDetails.position} Age: {selectedPlayerDetails.age}</div>
          <div>{selectedPlayerDetails.club_name}</div>
          <div>{selectedPlayerDetails.league_name}</div>
        </div>
        </div>
      )}
    </div>
  </div>
);

}

export default App;
