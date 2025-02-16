//client/src/components/MapComponent.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const MapUpdater = ({ mapPoints }) => {
  const map = useMap();

  useEffect(() => {
    if (mapPoints.length > 0) {
      const bounds = mapPoints.map(point => [point.lat, point.lng]);
      map.fitBounds(bounds);
    }
  }, [mapPoints, map]);

  return null;
};

const MapComponent = ({ mapPoints }) => {
  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {mapPoints.map((point, index) => (
        <Marker key={index} position={[point.lat, point.lng]}>
          <Popup>{point.name}</Popup>
        </Marker>
      ))}
      <MapUpdater mapPoints={mapPoints} />
    </MapContainer>
  );
};

export default MapComponent;
