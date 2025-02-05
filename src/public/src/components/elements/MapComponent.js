import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import "./style/MapComponent.css";

// Importa le icone di Leaflet
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";


// Definizione delle icone personalizzate
const houseIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const poiIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",
  iconSize: [15, 15],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
});

const MapComponent = ({ insertion, pois }) => {

    console.log("Coordinate della casa:", insertion.latitude, insertion.longitude);
    console.log("POIs ricevuti:", pois);
    
  if (!insertion.latitude || !insertion.longitude) {
    return <p>Caricamento della mappa...</p>;
  }

  return (
    <div className="map-container">
      <MapContainer center={[insertion.latitude, insertion.longitude]} zoom={14} className="map-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marker della casa */}
        <Marker position={[insertion.latitude, insertion.longitude]} icon={houseIcon}>
          <Popup>{insertion.address}</Popup>
        </Marker>

        {/* Marker per i POI */}
        {pois &&
          pois.map((poi, index) => (
            
            <Marker key={index} position={[poi.latitude, poi.longitude]} icon={poiIcon}>
              <Popup>
                <strong>{poi.name}</strong> <br />
                {poi.category} <br />
                {poi.address} <br />
                Distanza: {poi.distance}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
