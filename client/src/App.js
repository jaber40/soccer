// src/App.js
import React, { useState } from "react";
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

  // Function to handle the tournament selection change
  const handleTournamentChange = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setSelectedCountry(""); // Reset country selection when tournament changes
    setSelectedPlayer(""); // Reset player selection when tournament changes
    setPlayerData([]); // Clear player data when tournament changes
  };

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
        />
      )}

      {/* DataTable to display fetched player data */}
      {playerData.length > 0 && <DataTable playerData={playerData} />}
      <h1>Leaflet Map</h1>
      <MapComponent />
    </div>
  );
}

export default App;
