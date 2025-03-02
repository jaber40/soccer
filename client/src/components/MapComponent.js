// client/src/components/MapComponent.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const MapUpdater = ({ mapPoints, selectedPlayerId }) => {
  const map = useMap();

  useEffect(() => {
    console.log("🔹 Map Points Array:", mapPoints);
    console.log("🔹 Selected Player ID (Type: " + typeof selectedPlayerId + "):", selectedPlayerId);

    if (mapPoints.length > 0) {
      if (selectedPlayerId) {
        // Find the selected player's location in the points array
        const selectedPoint = mapPoints.find(point => {
          console.log(`➡ Checking point:`, point);
          console.log(`➡ point.player_id (Type: ${typeof point.player_id}):`, point.player_id);
          return Number(point.player_id) === Number(selectedPlayerId); // Ensure both are numbers
        });

        console.log("✅ Selected Player Point:", selectedPoint);

        if (selectedPoint) {
          console.log('🔍 Zooming to player location:', selectedPoint.lat, selectedPoint.lng);
          map.setView([selectedPoint.lat, selectedPoint.lng], 10, { animate: true });
        } else {
          console.log("⚠️ Selected player not found in map points.");
        }
      } else {
        // If no player is selected, fit the map to show all points
        const bounds = mapPoints.map(point => [point.lat, point.lng]);
        console.log("🔄 Fitting map bounds:", bounds);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } else {
      console.log("⚠️ No map points available.");
    }
  }, [mapPoints, selectedPlayerId, map]);

  return null;
};

const MapComponent = ({ mapPoints, selectedPlayerId }) => {
  // Log selectedPlayerId whenever it changes
  useEffect(() => {
    console.log('🎯 Selected Player ID Changed:', selectedPlayerId);
  }, [selectedPlayerId]);

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {mapPoints.map((point, index) => {
        console.log('📍 Rendering point:', point);

        return (
          <Marker key={index} position={[point.lat, point.lng]}>
            {/* Show Popup only for the selected player */}
            {point.player_id === selectedPlayerId && (
              <Popup autoOpen>{point.name}</Popup>
            )}
          </Marker>
        );
      })}
      <MapUpdater mapPoints={mapPoints} selectedPlayerId={selectedPlayerId} />
    </MapContainer>
  );
};

export default MapComponent;
