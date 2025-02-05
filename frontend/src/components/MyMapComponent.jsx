import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Set the dimensions of the map
const containerStyle = {
  width: "100%",
  height: "400px", // You can adjust the height as per your requirement
};

// Coordinates for Sri Lanka (example coordinates for Colombo)
const center = [6.9271, 79.8612]; // Latitude and Longitude of Colombo
const zoom = 8; // Adjust zoom to fit Sri Lanka

const MyMapComponent = () => {
  return (
    <MapContainer style={containerStyle} center={center} zoom={zoom} scrollWheelZoom={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // OpenStreetMap URL for tile layers
      />
      <Marker position={center}>
        <Popup>Colombo, Sri Lanka</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MyMapComponent;
