import React from 'react';
import './App.css'; // If you're using a CSS file
import DataTable from './DataTable'; // Import the DataTable component

function App() {
  return (
    <div className="App">
      <h1>My SQL Data App</h1>
      <DataTable /> {/* Display the DataTable component */}
    </div>
  );
}

export default App;

