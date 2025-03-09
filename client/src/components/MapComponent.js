// client/src/components/MapComponent.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster'; // Import MarkerClusterGroup

/// Define a smaller custom marker for unclustered points
const createCustomMarker = () => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="background-color: #90EE90; color: white; padding: 0px; border-radius: 50%; font-size: 4px; display: flex; align-items: center; justify-content: center; width: 10px; height: 10px; border: 1px solid black;"></div>`,
    iconSize: [10, 10],  // Smaller size for individual points
    iconAnchor: [5, 5], // Position the icon properly in the center
  });
};

// Define a larger custom marker for clusters with number
const createClusterMarker = (count) => {
  return L.divIcon({
    className: 'custom-cluster-icon',
    html: `<div style="background-color: #90EE90; color: white; padding: 5px 8px; border-radius: 50%; font-size: 8px; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border: 1px solid black;">${count}</div>`,
    iconSize: [20, 20],  // Larger size for clustered points
    iconAnchor: [10, 10], // Position the icon properly in the center
  });
};

// MapUpdater handles zooming to selected player or fitting all points
const MapUpdater = ({ mapPoints, selectedPlayerId }) => {
  const map = useMap();

  useEffect(() => {
    console.log("Map Points Array:", mapPoints);
    console.log("Selected Player ID (Type: " + typeof selectedPlayerId + "):", selectedPlayerId);

    if (mapPoints.length > 0) {
      if (selectedPlayerId) {
        // Find the selected player's location in the points array
        const selectedPoint = mapPoints.find(point => {
          console.log("Checking point:", point);
          console.log("point.player_id (Type: " + typeof point.player_id + "):", point.player_id);
          return Number(point.player_id) === Number(selectedPlayerId); // Ensure both are numbers
        });

        console.log("Selected Player Point:", selectedPoint);

        if (selectedPoint) {
          console.log('Zooming to player location:', selectedPoint.lat, selectedPoint.lng);
          map.setView([selectedPoint.lat, selectedPoint.lng], 6, { animate: true });
        } else {
          console.log("Selected player not found in map points.");
        }
      } else {
        // If no player is selected, fit the map to show all points
        const bounds = mapPoints.map(point => [point.lat, point.lng]);
        console.log("Fitting map bounds:", bounds);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } else {
      console.log("No map points available.");
    }
  }, [mapPoints, selectedPlayerId, map]);

  return null;
};

const MapComponent = ({ mapPoints, selectedPlayerId }) => {
  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Marker Cluster Group */}
      <MarkerClusterGroup
        iconCreateFunction={(cluster) => {
          const count = cluster.getChildCount();  // Get number of markers in the cluster
          return createClusterMarker(count);     // Create larger marker for clusters
        }}
        zoomToBoundsOnClick={false}     // Prevent automatic zoom when a cluster is clicked
        spiderfyOnMaxZoom={true}        // Enable spiderfying at max zoom
        spiderfyDistanceMultiplier={2}  // Adjust the multiplier to increase distance between spiderfied markers
        maxClusterRadius={1}            // Max pixel radius of cluster
        spiderfyOnEveryZoom={true}      // Ensures spiderfied markers remain expanded when zooming
        disableClusteringAtZoom={null}  // Ensures clustering is never disabled
      >
        {mapPoints.map((point, index) => {
          const customMarker = createCustomMarker();  // Use smaller marker for individual points

          return (
            <Marker key={index} position={[point.lat, point.lng]} icon={customMarker}>
              {/* Render popup for all players */}
              <Popup>{point.name}</Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
      <MapUpdater mapPoints={mapPoints} selectedPlayerId={selectedPlayerId} />
    </MapContainer>
  );
};

export default MapComponent;

