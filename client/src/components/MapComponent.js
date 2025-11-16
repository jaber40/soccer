// client/src/components/MapComponent.js
import React, { useEffect, useState, useRef } from 'react';
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

const MapUpdater = ({ mapPoints, selectedPlayerId, popupMode, countryPoints }) => {
  const map = useMap();
  const latestRender = useRef(0); // Track the latest render cycle

  useEffect(() => {
    latestRender.current += 1;
    const renderId = latestRender.current; // Capture the render ID

    map.closePopup();
    console.log('Num of country points:', countryPoints.length);
    console.log('Num of map points:', mapPoints.length);

   // Remove ALL previous markers when tournament or country selection changes
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Function to add markers
    const addMarker = (point, iconClass, popupContent) => {
      const icon = L.divIcon({ className: iconClass });
      const marker = L.marker([point.lat, point.lng], { icon }).addTo(map);
      if (popupContent) marker.bindPopup(popupContent);
    };

    // Render country markers
    if (mapPoints.length < 1 && countryPoints.length > 0) {
    countryPoints.forEach((country) => {
      if (country.lat && country.lng) {
        //addMarker(country, 'country-marker', `<strong>${country.name}</strong>`);
        const icon = createCountryMarker(country.name);
        L.marker([country.lat, country.lng], { icon }).addTo(map);
      } else {
        console.error('Invalid country coordinates:', country);
      }
    });
  }

    // Delay execution to ensure state updates settle
    setTimeout(() => {
      if (renderId !== latestRender.current) return; // Skip if not the last render

      if (mapPoints.length < 1 && countryPoints.length > 0) {
        // Zoom to country markers
        const latitudes = countryPoints.map((p) => p.lat);
        const longitudes = countryPoints.map((p) => p.lng);
        const countryBounds = [
          [Math.min(...latitudes), Math.min(...longitudes)],
          [Math.max(...latitudes), Math.max(...longitudes)]
        ];
        map.fitBounds(countryBounds, { padding: [25, 25] });

      } else if (selectedPlayerId) {
        // Zoom to selected player
        const selectedPoint = mapPoints.find((p) => Number(p.player_id) === Number(selectedPlayerId));
        if (selectedPoint) {
          map.invalidateSize();
          map.flyTo([selectedPoint.lat, selectedPoint.lng], 5, { animate: true });

          const popupContent = popupMode === 'birthplace'
          ? `
            <div class="popup-content">
            <strong>${selectedPoint.name}</strong><br>
            ${selectedPoint.birthplace}, ${selectedPoint.birth_country}
        </div>`
        : `
        <div class="popup-content">
          <strong>${selectedPoint.name}</strong><br>
          ${selectedPoint.club}<br>
          ${selectedPoint.league}
        </div>`;

          setTimeout(() => {
            if (renderId !== latestRender.current) return;
            L.popup().setLatLng([selectedPoint.lat, selectedPoint.lng]).setContent(popupContent).openOn(map);
          }, 300);
        }

      } else if (mapPoints.length > 0) {
        // Zoom to all player markers
        const latitudes = mapPoints.map((p) => p.lat);
        const longitudes = mapPoints.map((p) => p.lng);
        const bounds = [
          [Math.min(...latitudes), Math.min(...longitudes)],
          [Math.max(...latitudes), Math.max(...longitudes)]
        ];
        map.fitBounds(bounds, { padding: [25, 25] });
      }

    }, 300); // Small delay to ensure final state is used

  }, [mapPoints, selectedPlayerId, popupMode, map, countryPoints]);

  return null;
};



const MapComponent = ({ mapPoints, selectedPlayerId, popupMode, matchedCountries, setSelectedPlayer, setSelectedPlayerDetails, players }) => {
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

const handleMarkerClick = (playerId) => {
  console.log("Player clicked:", playerId); // Debugging

  // Set the selected player ID
  setSelectedPlayer(playerId);

  // Fetch the player details and update the state
  const selectedPlayer = players.find((p) => p.player_id === parseInt(playerId));
  if (selectedPlayer) {
    setSelectedPlayerDetails(selectedPlayer); // Update the player details for right-side container
  }
};

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
    click: () => handleMarkerClick(point.player_id),
    mouseover: (e) => {
      const popupContent = `
        <div class="popup-content">
          <strong>${point.name}</strong><br>
          ${popupMode === 'birthplace' 
            ? `${point.birthplace}, ${point.birth_country}`
            : `${point.club}<br>${point.league}`
          }
        </div>
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

