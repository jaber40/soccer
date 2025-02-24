// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import TournamentSelect from "./components/ComboBox"; // Import TournamentSelect
import CountrySelect from "./components/ComboBox2"; // Import CountrySelect
import DataTable from "./components/DataTable"; // Import DataTable
import MapComponent from './components/MapComponent';
import ComboBox3 from './components/ComboBox3'; // Import ComboBox3

function App() {
  const [selectedTournamentId, setSelectedTournamentId] = useState(""); // Track selected tournament
  const [selectedCountry, setSelectedCountry] = useState(""); // Track selected country
  const [selectedPlayer, setSelectedPlayer] = useState(""); // Track selected player
  const [playerData, setPlayerData] = useState([]); // Track player data for table
  const [mapPoints, setMapPoints] = useState([]); // Track player coordinates for map
  const [mapView, setMapView] = useState("club"); // "club" or "birthplace"
  const [selectedPlayerDetails, setSelectedPlayerDetails] = useState(null); // Player details state
  const [countries, setCountries] = useState([]); // Track countries list
  const [loading, setLoading] = useState(false); // Loading state for fetch operations
  const [error, setError] = useState(""); // Error handling state

  // Fetch countries when selectedTournamentId changes
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

  // Function to handle the tournament selection change
  const handleTournamentChange = (tournamentId) => {
    setSelectedTournamentId(tournamentId);
    setSelectedCountry(""); // Reset country selection when tournament changes
    setSelectedPlayer(""); // Reset player selection when tournament changes
    setPlayerData([]); // Clear player data when tournament changes
    setMapPoints([]); // Clear map points when tournament changes
    setError(""); // Reset error state
  };

  // Fetch player data and map points when selectedCountry or selectedTournamentId changes
  useEffect(() => {
    if (selectedCountry && selectedTournamentId) {
      setLoading(true);
      fetch(`http://localhost:5000/api/players/details?countryId=${selectedCountry}&tournamentId=${selectedTournamentId}`)
        .then((response) => response.json())
        .then((data) => {
          setPlayerData(data);
          const points = data
            .filter((player) => player.player_x && player.player_y)
            .map((player) => ({
              lat: mapView === "birthplace" ? player.player_x : player.club_x,
              lng: mapView === "birthplace" ? player.player_y : player.club_y,
              name: player.player_name,
            }));
          setMapPoints(points);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching player details:", error);
          setPlayerData([]);
          setMapPoints([]);
          setError("Failed to load player details.");
          setLoading(false);
        });
    } else {
      setPlayerData([]);
      setMapPoints([]);
    }
  }, [selectedCountry, selectedTournamentId, mapView]);

  // Handle the radio button change
  const handleMapViewChange = (event) => {
    setMapView(event.target.value); // Update map view between "club" and "birthplace"
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
          countries={countries} // Pass countries fetched in App.js
          setSelectedPlayer={setSelectedPlayer}
          setPlayerData={setPlayerData} // Pass setPlayerData to update table
          setMapPoints={setMapPoints}
          setSelectedPlayerDetails={setSelectedPlayerDetails} // Pass setter to ComboBox3
        />
      )}

      {/* Conditionally render ComboBox3 only when both selectedCountry and selectedTournamentId are set */}
      {selectedCountry && selectedTournamentId && (
        <ComboBox3
          selectedCountry={selectedCountry}
          selectedTournamentId={selectedTournamentId}
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
          setSelectedPlayerDetails={setSelectedPlayerDetails}
          selectedPlayerDetails={selectedPlayerDetails} // Pass player details
        />
      )}

      {/* Radio button to toggle map view */}
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

      {/* DataTable to display fetched player data */}
      {playerData.length > 0 && <DataTable playerData={playerData} />}

      {/* Display player details if available */}
      {selectedPlayerDetails && (
        <div>
          <h4>Selected Player: {selectedPlayerDetails.player_name}</h4>
          <p>Position: {selectedPlayerDetails.position}</p>
          <p>Age: {selectedPlayerDetails.age}</p>
          <p>Club: {selectedPlayerDetails.club_name}</p>
        </div>
      )}

      <h1>Leaflet Map</h1>
      <MapComponent mapPoints={mapPoints} />
    </div>
  );
}

export default App;
