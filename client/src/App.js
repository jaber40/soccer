// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import TournamentSelect from "./components/ComboBox"; // Import TournamentSelect
import CountrySelect from "./components/ComboBox2"; // Import CountrySelect
import DataTable from "./components/DataTable"; // Import DataTable
import MapComponent from './components/MapComponent';

function App() {
  const [selectedTournamentId, setSelectedTournamentId] = useState(""); // Track selected tournament
  const [selectedCountry, setSelectedCountry] = useState(""); // Track selected country
  const [selectedPlayer, setSelectedPlayer] = useState(""); // Track selected player
  const [playerData, setPlayerData] = useState([]); // Track player data for table
  const [mapPoints, setMapPoints] = useState([]); // Track player coordinates for map
  const [mapView, setMapView] = useState("club"); // "club" or "birthplace"

  // Function to handle the tournament selection change
  const handleTournamentChange = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setSelectedCountry(""); // Reset country selection when tournament changes
    setSelectedPlayer(""); // Reset player selection when tournament changes
    setPlayerData([]); // Clear player data when tournament changes
    setMapPoints([]); // Clear map points when tournament changes
  };

  // Update mapPoints when playerData or mapView changes
  useEffect(() => {
    const points = playerData.map(player => ({
      lat: mapView === "birthplace" ? player.player_x : player.club_x,
      lng: mapView === "birthplace" ? player.player_y : player.club_y,
      name: player.player_name,
    }));

    setMapPoints(points);
  }, [playerData, mapView]);

  return (
    <div className="App">
      <h1>My SQL Data App</h1>

      {/* TournamentSelect component */}
      <TournamentSelect onTournamentChange={handleTournamentChange} />

      {/* Conditionally render CountrySelect based on the selected tournament */}
      {selectedTournamentId && (
        <CountrySelect
          selectedTournamentId={selectedTournamentId}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
          setPlayerData={setPlayerData} // Pass setPlayerData to update table
          setMapPoints={setMapPoints}
        />
      )}

      {/* Radio Buttons for Map View Selection */}
      <div>
        <label>
          <input
            type="radio"
            name="mapView"
            value="birthplace"
            checked={mapView === "birthplace"}
            onChange={() => setMapView("birthplace")}
          />
          View Birthplaces
        </label>
        <label>
          <input
            type="radio"
            name="mapView"
            value="club"
            checked={mapView === "club"}
            onChange={() => setMapView("club")}
          />
          View Club Locations
        </label>
      </div>

      {/* DataTable to display fetched player data */}
      {playerData.length > 0 && <DataTable playerData={playerData} />}

      <h1>Leaflet Map</h1>
      <MapComponent mapPoints={mapPoints} />
    </div>
  );
}

export default App;
