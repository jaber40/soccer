import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataTable = () => {
  const [data, setData] = useState([]); // State to store fetched data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state

  useEffect(() => {
    // Fetch data from the backend
    axios.get('http://localhost:5000/data') // Update this URL if needed
      .then(response => {
        setData(response.data); // Set the fetched data into state
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch(error => {
        setError(error.message); // If error occurs, set error message
        setLoading(false); // Set loading to false in case of error
      });
  }, []); // Empty dependency array ensures this runs once on component mount

  if (loading) {
    return <div>Loading...</div>; // Show loading state until data is fetched
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if fetch fails
  }

  return (
    <div>
      <h2>Data from MySQL Database</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {/* Update these table headers according to your database columns */}
            <th>ID</th>
            <th>Name</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {/* Map over data and create table rows */}
          {data.map((item) => (
            <tr key={item.player_id}> {/* Use unique id from your data */}
              <td>{item.player_id}</td>
              <td>{item.player_name}</td>
              <td>{item.city_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
