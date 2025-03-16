// client/src/components/MapComponent.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import '../App.css'; // Import the updated App.css

// Define a custom marker for individual points
const createCustomMarker = () => L.divIcon({
  className: 'custom-marker-icon'
});

// Define a custom cluster marker
const createClusterMarker = (count) => L.divIcon({
  className: 'custom-cluster-icon',
  html: `${count}`
});

// Define a custom country marker
const createCountryMarker = (count) => L.divIcon({
  className: 'country-cluster-icon',
});

const MapUpdater = ({ mapPoints, selectedPlayerId, popupMode }) => {
  const map = useMap();

  useEffect(() => {
    map.closePopup();

    if (mapPoints.length > 0) {
      if (selectedPlayerId) {
        const selectedPoint = mapPoints.find(point => Number(point.player_id) === Number(selectedPlayerId));

        if (selectedPoint) {
          console.log('Zooming to:', selectedPoint.lat, selectedPoint.lng);
          map.invalidateSize();
          map.flyTo([selectedPoint.lat, selectedPoint.lng], 6, { animate: true });

          const popupContent = popupMode === 'birthplace'
            ? `<strong>${selectedPoint.name}</strong><br>${selectedPoint.birthplace}, ${selectedPoint.birth_country}`
            : `<strong>${selectedPoint.name}</strong><br>${selectedPoint.club}<br>${selectedPoint.league}`;

          setTimeout(() => {
            L.popup()
              .setLatLng([selectedPoint.lat, selectedPoint.lng])
              .setContent(popupContent)
              .openOn(map);
          }, 300);
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
            eventHandlers={{
              mouseover: (e) => {
                const popupContent = `
                  <strong>${point.name}</strong><br>
                  ${popupMode === 'birthplace' ? `${point.birthplace}, ${point.birth_country}` : `${point.club}<br>${point.league}`}
                `;

                const popup = L.popup()
                  .setLatLng(e.latlng)
                  .setContent(popupContent)
                  .openOn(e.target._map);

                e.target.bindPopup(popup).openPopup();
              },
              mouseout: (e) => {
                e.target.closePopup();
              },
            }}
          />
        ))}
      </MarkerClusterGroup>

      <MapUpdater mapPoints={mapPoints} selectedPlayerId={selectedPlayerId} popupMode={popupMode} />
    </MapContainer>
  );
};

export default MapComponent;

