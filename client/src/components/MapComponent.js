// client/src/components/MapComponent.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster'; // Import MarkerClusterGroup

// Define a custom marker for individual points (Orange-Peach)
const createCustomMarker = () => {
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="background-color: #FF8000; color: white; padding: 0px; border-radius: 50%; font-size: 4px; display: flex; align-items: center; justify-content: center; width: 10px; height: 10px; border: 1px solid black;"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
};

// Define a custom cluster marker
const createClusterMarker = (count) => {
  return L.divIcon({
    className: 'custom-cluster-icon',
    html: `<div style="background-color: #FF8000; color: black; padding: 5px 8px; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border: 1px solid black;">${count}</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const MapUpdater = ({ mapPoints, selectedPlayerId, popupMode }) => {
  const map = useMap();

  useEffect(() => {
    map.closePopup(); // Close any existing popups

    if (mapPoints.length > 0) {
      if (selectedPlayerId) {
        const selectedPoint = mapPoints.find(point => Number(point.player_id) === Number(selectedPlayerId));

        if (selectedPoint) {
          console.log('Zooming to:', selectedPoint.lat, selectedPoint.lng);
          map.invalidateSize();
          map.flyTo([selectedPoint.lat, selectedPoint.lng], 6, { animate: true });

          // Update popup content based on popupMode
          const popupContent =
            popupMode === 'birthplace'
              ? `<strong>${selectedPoint.name}</strong><br>${selectedPoint.birthplace}`
              : `<strong>${selectedPoint.name}</strong><br>${selectedPoint.club}`;

          setTimeout(() => {
            L.popup()
              .setLatLng([selectedPoint.lat, selectedPoint.lng])
              .setContent(popupContent)
              .openOn(map);
          }, 300); // Small delay to ensure popup updates
        }
      } else {
        const bounds = mapPoints.map(point => [point.lat, point.lng]);
        if (bounds.length > 0) {
          map.invalidateSize();
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    } else {
      setTimeout(() => {
        map.invalidateSize();
        map.setView([20, 0], 2);
      }, 300);
    }
  }, [mapPoints, selectedPlayerId, popupMode, map]);

  return null;
};


const MapComponent = ({ mapPoints, selectedPlayerId, popupMode }) => {
  return (
    <MapContainer 
      center={[20, 0]} 
      zoom={2} 
      maxBounds={[[-90, -180], [90, 180]]} 
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MarkerClusterGroup
        iconCreateFunction={(cluster) => createClusterMarker(cluster.getChildCount())}
        zoomToBoundsOnClick={false}
        spiderfyOnMaxZoom={true}
        spiderfyDistanceMultiplier={2}
        maxClusterRadius={1}
        spiderfyOnEveryZoom={true}
        disableClusteringAtZoom={null}
      >
        {mapPoints.map((point, index) => (
          <Marker
            key={index}
            position={[point.lat, point.lng]}
            icon={createCustomMarker()}
            data-player-id={point.player_id}
          >
            <Popup>
              <strong>{point.name}</strong><br />
              {popupMode === 'birthplace' ? point.birthplace : point.club}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      <MapUpdater mapPoints={mapPoints} selectedPlayerId={selectedPlayerId} popupMode={popupMode} />
    </MapContainer>
  );
};


export default MapComponent;
