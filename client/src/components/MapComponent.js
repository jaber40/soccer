// client/src/components/MapComponent.js
import React, { useEffect, useState } from 'react';
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
const createCountryMarker = (countryName) => L.divIcon({
  className: 'country-marker-icon',
  html: `<div class="country-marker">${countryName}</div>`
});

const MapUpdater = ({ mapPoints, selectedPlayerId, popupMode, countryPoints, clearCountryMarkers }) => {
  const map = useMap();

  useEffect(() => {
    map.closePopup();

    console.log('Num of country points:', countryPoints.length);
    console.log('Num of map points:', mapPoints.length);

    if (mapPoints.length < 1 && countryPoints.length > 0) {
      //map.setView([20, 0], 2); // Resets zoom to the full world view
      const latitudes = countryPoints.map(point => point.lat);
  const longitudes = countryPoints.map(point => point.lng);
  const countryBounds = [
    [Math.min(...latitudes), Math.min(...longitudes)],
    [Math.max(...latitudes), Math.max(...longitudes)]
  ];

  map.fitBounds(countryBounds, { padding: [50, 50] });
    }

    // Remove ALL previous markers when tournament or country selection changes
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

     // Render country markers
    if (countryPoints.length > 0) {
      countryPoints.forEach((point) => {
        if (point.lat && point.lng) {
          const icon = createCountryMarker(point.name);
          L.marker([point.lat, point.lng], { icon }).addTo(map);
        } else {
          console.error('Invalid coordinates for country:', point);
        }
      });
      //map.setView([20, 0], 2); // Resets zoom to the full world view
    }

    if (mapPoints.length > 0 && countryPoints.length > 0) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker && layer.options.icon.options.className === 'country-marker-icon') {
          map.removeLayer(layer);
        } 
      });
    }

// Update: Zoom to the extent of player markers and render player markers
if (selectedPlayerId) {
  // If a player is selected, zoom to their location
  const selectedPoint = mapPoints.find(point => Number(point.player_id) === Number(selectedPlayerId));
  if (selectedPoint) {
    map.invalidateSize();
    map.flyTo([selectedPoint.lat, selectedPoint.lng], 6, { animate: true }); // Fly to selected player
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
} else if (mapPoints.length > 0) {
  // If no player is selected but there are player points, zoom to bounds of all players
  const latitudes = mapPoints.map(point => point.lat);
  const longitudes = mapPoints.map(point => point.lng);
  const bounds = [
    [Math.min(...latitudes), Math.min(...longitudes)],
    [Math.max(...latitudes), Math.max(...longitudes)]
  ];

  // Zoom to the bounds of player markers
  map.fitBounds(bounds, { padding: [50, 50] });
}

// Optionally clear selected player when a country is selected (in parent component, for example)



  }, [mapPoints, selectedPlayerId, popupMode, map, countryPoints, clearCountryMarkers]);

  return null;
};

const MapComponent = ({ mapPoints, selectedPlayerId, popupMode, matchedCountries }) => {
  const [countryPoints, setCountryPoints] = useState([]);

  useEffect(() => {
    if (matchedCountries && matchedCountries.length > 0) {
      console.log("Matched Countries:", matchedCountries);
      
      // Clear country markers when ComboBox2 selection changes
      setCountryPoints([]);

      const filteredCountries = matchedCountries.map(country => ({
        name: country.country_name,
        lat: country.y,  // Fix: 'y' is latitude
        lng: country.x,  // Fix: 'x' is longitude
      }));

      setCountryPoints(filteredCountries);
    } else {
      setCountryPoints([]); // Ensure clearing when no matched countries
    }
  }, [matchedCountries]);

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

      <MapUpdater
        mapPoints={mapPoints}
        selectedPlayerId={selectedPlayerId}
        popupMode={popupMode}
        countryPoints={countryPoints}
        clearCountryMarkers={() => setCountryPoints([])} // Pass clearing function
      />
    </MapContainer>
  );
};

export default MapComponent;
