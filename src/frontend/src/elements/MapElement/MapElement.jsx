import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "./MapElement.scss";

// Icona per il marker della casa
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const houseIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Icona per i POI
const poiIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",
  iconSize: [15, 15],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
});

// Bottone per rigeolocalizzare la mappa
const RecenterButton = ({ lat, lng }) => {
  const map = useMap();

  const handleRecenter = () => {
    map.setView([lat, lng], 14);
  };

  return (
    <button className="recenter-button" onClick={handleRecenter}>
      Centra sulla casa
    </button>
  );
};

const MapElement = ({ insertion }) => {
  const token = localStorage.getItem("token");
  const [selectedCategory, setSelectedCategory] = useState("Ristorante");
  const [pois, setPois] = useState([]);

  // Fetch dei POI per la categoria selezionata
  useEffect(() => {
    const fetchPOIs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/insertion/${insertion.id}/pois?category=${selectedCategory}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPois(response.data.pois);
      } catch (error) {
        console.error("Errore nel recupero dei POI:", error);
      }
    };

    if (insertion && insertion.id && selectedCategory) {
      fetchPOIs();
    }
  }, [insertion, selectedCategory, token]);

  if (!insertion.latitude || !insertion.longitude) {
    return <p>Caricamento della mappa...</p>;
  }

  return (
    <div className="map-element">
      <div className="address-info">
        <h2>Posizione e Punti d'Interesse</h2>
        <p><strong>Regione:</strong> {insertion.region}</p>
        <p><strong>Provincia:</strong> {insertion.province}</p>
        <p><strong>Comune:</strong> {insertion.municipality}</p>
        <p>
          <strong>Indirizzo:</strong> {insertion.address} {insertion.house_number}
        </p>
        <p><strong>CAP:</strong> {insertion.cap}</p>
      </div>

      <div className="map-controls">
        <label htmlFor="poi-category">Categoria POI:</label>
        <select
          id="poi-category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="Ristorante">Ristoranti</option>
          <option value="Mezzi di Trasporto">Mezzi di Trasporto</option>
          <option value="Supermercato">Supermercati</option>
          <option value="Farmacia">Farmacie</option>
        </select>
        <hr />
        <label> Nel raggio di 1km</label>
      </div>
      <div className="map-border">
        <MapContainer
          center={[insertion.latitude, insertion.longitude]}
          zoom={15}
          className="map-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <RecenterButton lat={insertion.latitude} lng={insertion.longitude} />
          {/* Disegna un cerchio di 1 km attorno alla casa */}
          <Circle
            center={[insertion.latitude, insertion.longitude]}
            radius={1000} // 1000 metri = 1 km
            pathOptions={{ color: "#20A39E", fillOpacity: 0.2 }}
          />
          <Marker
            position={[insertion.latitude, insertion.longitude]}
            icon={houseIcon}
          >
            <Popup>{insertion.address}</Popup>
          </Marker>
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
      
    </div>
  );
};

export default MapElement;
