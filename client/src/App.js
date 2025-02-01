import React, { useState } from "react";
import "./App.css";
import TournamentSelect from "./components/ComboBox"; // Import TournamentSelect
import CountrySelect from "./components/ComboBox2"; // Import CountrySelect

function App() {
  const [selectedTournamentId, setSelectedTournamentId] = useState(""); // Use tournament_id
  const [selectedCountry, setSelectedCountry] = useState(""); // Track selected country

  // Function to handle the tournament selection change
  const handleTournamentChange = (tournamentId) => {
    setSelectedTournamentId(tournamentId); // Update state with tournament_id
    setSelectedCountry(""); // Reset country selection when tournament changes
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
          setSelectedCountry={setSelectedCountry} // Pass function to reset country selection
        />
      )}
    </div>
  );
}

export default App;
