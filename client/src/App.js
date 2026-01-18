// src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import TournamentSelect from "./components/ComboBox";
import CountrySelect from "./components/ComboBox2";
import DataTable from "./components/DataTable";
import MapComponent from './components/MapComponent';
import ComboBox3 from './components/ComboBox3';

import ContactForm from "./components/ContactForm";

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

  const [showForm, setShowForm] = useState(false);


//Handle inactivity for connectivity to database
// 5 minutes
const INACTIVITY_LIMIT = 5 * 60 * 1000;

let lastActivity = Date.now();

// Normal activity events (PC + mobile)
const activityEvents = [
  "mousemove",
  "keydown",
  "click",
  "touchstart",
  "scroll"
];

activityEvents.forEach(event => {
  window.addEventListener(event, () => {
    lastActivity = Date.now();
  });
});

// Desktop works fine with a normal interval
setInterval(() => {
  if (Date.now() - lastActivity > INACTIVITY_LIMIT) {
    window.location.reload();
  }
}, 30000); // 30 seconds

// 👇 Mobile fix: detect coming back from screen off / background
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    // Tab became visible again
    if (Date.now() - lastActivity > INACTIVITY_LIMIT) {
      window.location.reload();
    }
  }
});




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
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/countries/${selectedTournamentId}`)
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
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/players/details?countryId=${selectedCountry}&tournamentId=${selectedTournamentId}`)
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
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/players/selected/details?playerId=${selectedPlayer}&tournamentId=${selectedTournamentId}`)
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

      <button
        onClick={() => setShowForm(true)}
        style={{
          position: "absolute",   // float above other elements
          top: "10px",      // distance from bottom
          right: "10px",       // distance from left
          zIndex: 9999,        // on top of everything
          padding: "10px 10px",
          backgroundColor: "black",
          color: "lightgray",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "12px",
          display: "inline-block",  // prevents flex parent from stretching
          width: "auto",            // ensure it only wraps text
          height: "auto",
          opacity: 0.6,
          border: "1px solid lightgray",
          alignSelf: "flex-start",  // stops flex from stretching vertically
        }}
      >
        Contact
      </button>
      

    </div>

    {/* Right-side container for the rest of the components */}
    <div className="right-side-container">
    <div className="left-side-mini">
      {/* Title and Tournament Image */}
      <h3 style={{ color: "white" }}>International Soccer</h3>
     <img
      src={`images/tournaments/${selectedTournamentId}.jpg`}
      style={{ width: "20%", border: "1px solid black", objectFit: "contain" }}
      onError={(e) => {
        e.target.onerror = null;
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
            style={{ margin: "5px", border: "1px solid black" }}
            onError={(e) => {
              e.target.src = "images/flag_logo.jpg";
            }}
          />
        </div>
      )}
      </div>

      {selectedPlayerDetails && (
        <div className="right-side-mini">
        <div>
          {/* Images commented out below */} 
          {/*
          <img 
            src={`images/players/${selectedPlayerDetails.player_id}.jpg`}
            alt={selectedPlayerDetails.player_name}
            className="player-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "images/player.jpg";
            }}
          />
          <br />
          <img 
            src={`images/clubs/${selectedPlayerDetails.club_id}.jpg`} 
            className="club-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "images/club_logo.jpg";
            }}
          />
          <img 
            src={`images/leagues/${selectedPlayerDetails.league_id}.jpg`} 
            className="league-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "images/league_logo.jpg";
            }}
          />
            */}
       <div className="player-details">
        <div>{selectedPlayerDetails.player_name}</div>
        <div>{selectedPlayerDetails.player_city_name}, {selectedPlayerDetails.country_name}</div>
        <div>{selectedPlayerDetails.position}</div>
        <div>Age: {selectedPlayerDetails.age}</div>
        <div>{selectedPlayerDetails.club_name}</div>
        <div>{selectedPlayerDetails.league_name}</div>
      </div>



             
         </div>
        </div>
      )}
      </div>

       {showForm && (
        <div
          style={{
            position: "absolute",     // <--- NOT FIXED
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)", // dark overlay
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowForm(false)} // click outside closes modal
        >
          <div
            style={{
              backgroundColor: "#3a3a3a",
              padding: "20px",
              borderRadius: "10px",
              width: "90%",          // responsive width
              maxWidth: "500px",     // max size
              maxHeight: "90vh",     // prevent overflow
              overflowY: "auto",     // scroll if content is tall
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ContactForm />
            <button
              onClick={() => setShowForm(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#4a4a4a",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "5px 10px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "black"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#4a4a4a"}
            >
              Close
            </button>
          </div>
        </div>
      )}

  </div>
);

}

export default App;
