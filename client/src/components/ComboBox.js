import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TournamentSelect = ({ onTournamentChange }) => {
  const [tournaments, setTournaments] = useState([]); // State to store tournament data
  const [selectedTournament, setSelectedTournament] = useState(''); // State for selected tournament

  // Fetch tournament data from the server
  useEffect(() => {
    axios.get('http://localhost:5000/api/tournaments') // Make API call to fetch tournaments
      .then((response) => {
        setTournaments(response.data); // Populate the tournaments state
      })
      .catch((error) => {
        console.error('Error fetching tournaments:', error); // Handle errors
      });
  }, []); // Empty dependency array to fetch once when the component mounts

  // Handle the selection change
  const handleChange = (event) => {
    const tournamentId = event.target.value; // Get selected tournament_id
    setSelectedTournament(tournamentId); // Update local state
    console.log('Tournament selected (ID):', tournamentId);

    onTournamentChange(tournamentId); // Pass the tournament_id to the parent
  };

  return (
    <div>
      <label htmlFor="tournament">Select Tournament:</label>
      <select
        id="tournament"
        value={selectedTournament}
        onChange={handleChange}
      >
        <option value="">--Select a Tournament--</option>
        {tournaments.map((tournament) => (
          <option key={tournament.tournament_id} value={tournament.tournament_id}>
            {tournament.tournament_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TournamentSelect;
