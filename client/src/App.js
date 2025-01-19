import React from 'react';
import './App.css'; // If you're using a CSS file
import TournamentSelect from './ComboBox'; // Import the TournamentSelect component

function App() {
  return (
    <div className="App">
      <h1>My SQL Data App</h1>
      <TournamentSelect /> {/* Replace DataTable with TournamentSelect */}
    </div>
  );
}

export default App;
