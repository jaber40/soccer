//client/src/components/DataTable.js
import React from "react";

const DataTable = ({ playerData }) => {
  return (
    <div>
      <table border="1" className="data-table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Player Name</th>
            <th>Position</th>
            <th>Age</th>
            <th>Birthplace</th>
            <th>Country</th>
            <th>Club</th>
            <th>League</th>
            <th>Division</th>
          </tr>
        </thead>
        <tbody>
          {playerData.length > 0 ? (
            playerData.map((player) => (
              <tr key={player.player_id}> {/* Use unique player_id as key */}
                <td>{player.number}</td>
                <td>{player.player_name}</td>
                <td>{player.position}</td>
                <td>{player.age}</td>
                <td>{player.player_city_name}</td>
                <td>{player.country_name}</td>
                <td>{player.club_name}</td>
                <td>{player.league_name}</td>
                <td>{player.division}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
