import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TournamentSelect = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');

  // Fetch tournament data from the server
  useEffect(() => {
    axios.get('http://localhost:5000/tournaments')
      .then(response => {
        setTournaments(response.data); // Populate the tournaments state
      })
      .catch(error => {
        console.error('There was an error fetching tournaments:', error);
      });
  }, []);

  // Handle the selection change
  const handleChange = (event) => {
    setSelectedTournament(event.target.value);
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
        {tournaments.map((tournament, index) => (
          <option key={index} value={tournament.tournament_name}>
            {tournament.tournament_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TournamentSelect;
