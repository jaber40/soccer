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
  const [mapView, setMapView] = useState("club"); // Handle map view state here
  const [selectedPlayerDetails, setSelectedPlayerDetails] = useState(null);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (selectedTournamentId) {
      setLoading(true);
      fetch(`http://localhost:5000/api/countries/${selectedTournamentId}`)
        .then((response) => response.json())
        .then((data) => {
          setCountries(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching countries:", error);
          setCountries([]);
          setError("Failed to load countries.");
          setLoading(false);
        });
    } else {
      setCountries([]);
    }
  }, [selectedTournamentId]);

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
              player_id: player.player_id, // Add player_id here
              lat: mapView === "birthplace" ? player.player_x : player.club_x,
              lng: mapView === "birthplace" ? player.player_y : player.club_y,
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

   // Handle ComboBox3 change (selecting a player)
  const handlePlayerChange = (playerId) => {
    setSelectedPlayer(playerId); // This will update the selected player and trigger map zoom
    console.log('Selected Player ID:', playerId);  // Verify the change
  };

  const handleMapViewChange = (event) => {
    setMapView(event.target.value); // Update map view
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

  return (
    <div className="App">
      <h1>My SQL Data App</h1>

      <TournamentSelect onTournamentChange={handleTournamentChange} />

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

      {playerData.length > 0 && <DataTable playerData={playerData} />}

      {selectedPlayerDetails && (
        <div>
          <h4>Selected Player: {selectedPlayerDetails.player_name}</h4>
          <p>Position: {selectedPlayerDetails.position}</p>
          <p>Age: {selectedPlayerDetails.age}</p>
          <p>Club: {selectedPlayerDetails.club_name}</p>
        </div>
      )}

      <h1>Leaflet Map</h1>
      <MapComponent mapPoints={mapPoints} selectedPlayerId={selectedPlayer} />
    </div>
  );
}

export default App;
