import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Select from "react-select";
import "./FilterComponent.scss";

const regioni = {
  Campania: ["Napoli", "Salerno", "Caserta", "Benevento", "Avellino"],
  Lombardia: ["Milano", "Bergamo", "Brescia", "Como", "Mantova"],
  Lazio: ["Roma", "Viterbo", "Latina", "Frosinone", "Rieti"],
};

const regionOptions = Object.keys(regioni).map((regione) => ({ value: regione, label: regione }));

export default function FilterComponent() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [rooms, setRooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [balcony, setBalcony] = useState(0);
  const [energyclass, setEnergyClass] = useState("A");
  const [price, setPrice] = useState([10000, 1000000]);
  const [size, setSize] = useState([20, 1000]);
  const [garage, setGarage] = useState(false);
  const [garden, setGarden] = useState(false);
  const [elevator, setElevator] = useState(false);
  const [climate, setClimate] = useState(false);
  const [terrace, setTerrace] = useState(false);
  const [reception, setReception] = useState(false);
  const [insertions, setInsertions] = useState([]);


  const comuneOptions = selectedRegion ? regioni[selectedRegion.value].map((comune) => ({ value: comune, label: comune })) : [];


  const handleFilter = async () => {
    const filters = {
      region: selectedRegion ? selectedRegion.value : null, 
      municipality: selectedMunicipality ? selectedMunicipality.value : null,
      room: Number(rooms),
      bathroom: Number(bathrooms),
      price: price[1], 
      surface: size[0],
      garage,
      garden,
      elevator,
      balcony: Number(balcony),
      energyclass,
      climate,
      terrace,
      reception
    };

    try {
        navigate("/filteredSearch", { state: filters });

        
    } catch (error) {
        console.error("Errore nel filtraggio:", error);
    }
  };

  return (
    <div className="filter-container">
      <h2 className="title">Filtri di Ricerca</h2>
      <div className="filters">
        <Select options={regionOptions} placeholder="Regione" onChange={setSelectedRegion} className="select" />
        <Select options={comuneOptions} placeholder="Comune" onChange={setSelectedMunicipality} className="select" isDisabled={!selectedRegion} />
        <div className="input-group">
          <label>Stanze</label>
          <select value={rooms} onChange={(e) => setRooms(e.target.value)} className="dropdown">
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Bagni</label>
          <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="dropdown">
            {[0, 1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Balconi</label>
          <select value={balcony} onChange={(e) => setBalcony(e.target.value)} className="dropdown">
            {[0, 1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Classe Energetica</label>
          <select value={energyclass} onChange={(e) => setEnergyClass(e.target.value)} className="dropdown">
            {["G", "F", "E", "D", "C", "B", "A", "A2", "A3", "A4"].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        <div className="range-group">
          <label>Prezzo: €{price[0]} - {price[1]}</label>
          <input type="range" min="10000" max="1000000" value={price[1]} onChange={(e) => setPrice([10000, e.target.value])} className="range" />
        </div>
        <div className="range-group">
          <label>Superficie: {size[0]} - {size[1]} mq</label>
          <input type="range" min="20" max="1000" value={size[0]} onChange={(e) => setSize([e.target.value, 1000])} className="range" />
        </div>
        <div className="toggle-group">
          <label>Garage</label>
          <input type="checkbox" checked={garage} onChange={() => setGarage(!garage)} />
        </div>
        <div className="toggle-group">
          <label>Giardino</label>
          <input type="checkbox" checked={garden} onChange={() => setGarden(!garden)} />
        </div>
        <div className="toggle-group">
          <label>Ascensore</label>
          <input type="checkbox" checked={elevator} onChange={() => setElevator(!elevator)} />
        </div>
        <div className="toggle-group">
          <label>Climatizzazione</label>
          <input type="checkbox" checked={climate} onChange={() => setClimate(!climate)} />
        </div>
        <div className="toggle-group">
          <label>Terrazzo</label>
          <input type="checkbox" checked={terrace} onChange={() => setTerrace(!terrace)} />
        </div>
        <div className="toggle-group">
          <label>Portineria</label>
          <input type="checkbox" checked={reception} onChange={() => setReception(!reception)} />
        </div>
        <button className="filter-button" onClick={handleFilter}>
          Filtra
        </button>
      </div>
    </div>
  );
}
