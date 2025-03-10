import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./FilterComponent.scss";
import CheckBox from "../../components/checkBox/CheckBox";
import Button from "../../components/button/Button";
import RangeSlider from "../../components/rangeSlider/RangeSlider";

// Importa i file JSON
import regionsData from "../../data/gi_regioni.json";
import provincesData from "../../data/gi_province.json";
import municipalitiesData from "../../data/gi_comuni.json";

export default function FilterComponent({ initialFilters = {} }) {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState(
    initialFilters.region ? { value: initialFilters.region, label: initialFilters.region } : null
  );
  const [selectedProvince, setSelectedProvince] = useState(
    initialFilters.province ? { value: initialFilters.province, label: initialFilters.province } : null
  );
  const [selectedMunicipality, setSelectedMunicipality] = useState(
    initialFilters.municipality ? { value: initialFilters.municipality, label: initialFilters.municipality } : null
  );
  const [rooms, setRooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [balcony, setBalcony] = useState(0);
  const [energyclass, setEnergyClass] = useState("");
  const [price, setPrice] = useState([10000, 1000000]);
  const [size, setSize] = useState([20, 2000]);
  const [garage, setGarage] = useState("qualsiasi");
  const [garden, setGarden] = useState("qualsiasi");
  const [elevator, setElevator] = useState("qualsiasi");
  const [climate, setClimate] = useState("qualsiasi");
  const [terrace, setTerrace] = useState("qualsiasi");
  const [reception, setReception] = useState("qualsiasi");
  const [category, setCategory] = useState({ value: "BUY", label: "Vendita" });


  const categoriaOptions = [
    { value: "BUY", label: "Vendita" },
    { value: "RENT", label: "Affitto" }, 
  ];

  const balconyOptions = Array.from({ length: 6 }, (_, i) => ({
    value: i,
    label: i === 0 ? "Nessuna preferenza per i balconi" : `${i} Balcon${i > 1 ? 'i' : 'e'}`,
  }));

  const bathroomOptions = Array.from({ length: 6 }, (_, i) => ({
    value: i,
    label: i === 0 ? "Nessuna preferenza per i bagni" : `${i} Bagn${i > 1 ? 'i' : 'o'}`,
  }));

  const roomOptions = Array.from({ length: 6 }, (_, i) => ({
    value: i,
    label: i === 0 ? "Nessuna preferenza per le camere" : `${i} Camer${i > 1 ? 'e' : 'a'}`,
  }));

  const energyClassOptions = [
    { value: "", label: "Qualsiasi classe energetica"},
    { value: "A4", label: "A4" },
    { value: "A3", label: "A3" },
    { value: "A2", label: "A2" },
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "F", label: "F" },
    { value: "G", label: "G" },
  ];

  const regionOptions = regionsData.map((region) => ({
    value: region.codice_regione,
    label: region.denominazione_regione,
  }));
  
  const provinceOptions = selectedRegion
      ? provincesData
          .filter((prov) => prov.codice_regione === selectedRegion.value)
          .map((prov) => ({
            value: prov.sigla_provincia,
            label: prov.denominazione_provincia,
          }))
      : [];
  
  const municipalityOptions = selectedProvince
      ? municipalitiesData
          .filter((mun) => mun.sigla_provincia === selectedProvince.value)
          .map((mun) => ({
            value: mun.codice_istat,
            label: mun.denominazione_ita,
          }))
      : [];


  const handleCheckboxChange = (setState) => (e) => {
    setState(e.target.checked ? true : "qualsiasi");
  };
    

  const handleFilter = async () => {
    const filters = {
      region: selectedRegion ? selectedRegion.label : null,
      province: selectedProvince ? selectedProvince.label : null,
      municipality: selectedMunicipality ? selectedMunicipality.label : null,
      contract: category.value,
      price: price[0],
      room: Number(rooms.value),
      bathroom: Number(bathrooms.value),
      balcony: Number(balcony.value),
      energyclass: energyclass,
      surface: size[0],
      garage,
      garden,
      elevator,
      climate,
      terrace,
      reception,
    };

    try {
      console.log(filters);
      navigate(`/filtered-search?ts=${new Date().getTime()}`, { state: filters });
    } catch (error) {
      console.error("Errore nel filtraggio:", error);
    }
  };

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h2 className="title">Filtri di Ricerca</h2>
        <button 
          className="toggle-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Nascondi" : "Mostra"}
        </button>
      </div>
      {showFilters && (
        <>
          <div className="select-group">
            <Select 
              options={categoriaOptions} 
              value={category} 
              onChange={setCategory} 
              className="select"
            />
            <Select 
              options={regionOptions} 
              placeholder="Regione" 
              onChange={(selected) => {
                setSelectedRegion(selected);
                setSelectedProvince(null);
                setSelectedMunicipality(null);
              }} 
              className="select" 
              value={selectedRegion}
            />
            <Select 
              options={provinceOptions} 
              placeholder="Provincia" 
              onChange={(selected) => {
                setSelectedProvince(selected);
                setSelectedMunicipality(null);
              }}
              className="select" 
              isDisabled={!selectedRegion}
              value={selectedProvince}
            />
            <Select 
              options={municipalityOptions} 
              placeholder="Comune" 
              onChange={(selected) => setSelectedMunicipality(selected)}
              className="select" 
              isDisabled={!selectedProvince}
              value={selectedMunicipality}
            />
          </div>
          {/* Altri filtri */}
          <div className="select-group">
            <Select
              options={roomOptions}
              value={rooms}
              onChange={setRooms}
              placeholder="Numero Camere"
              className="select"
            />
            <Select
              options={bathroomOptions}
              value={bathrooms}
              onChange={setBathrooms}
              placeholder="Numero Bagni"
              className="select"
            />
            <Select
              options={balconyOptions}
              value={balcony}
              onChange={setBalcony}
              placeholder="Numero Balconi"
              className="select"
            />
            <Select
              options={energyClassOptions}
              value={energyClassOptions.find(option => option.value === energyclass) || null}
              onChange={(selectedOption) => setEnergyClass(selectedOption.value)}
              placeholder="Classe Energetica"
              className="select"
            />
          </div>
          <div className="range-group">
            <RangeSlider
              label="Prezzo Massimo"
              min={10000}
              max={1000000}
              value={price}
              onChange={setPrice}
              unit="€"
            />
          </div>
          <div className="range-group">
            <RangeSlider
              label="Superficie"
              min={20}
              max={2000}
              value={size}
              onChange={setSize}
              unit="mq"
            />
          </div>
          <div className="checkbox-group">
            <div className="toggle-group">
              <CheckBox label="Garage" checked={garage === true} onChange={handleCheckboxChange(setGarage)} />
            </div>
            <div className="toggle-group">
              <CheckBox label="Giardino" checked={garden === true} onChange={handleCheckboxChange(setGarden)} />
            </div>
            <div className="toggle-group">
              <CheckBox label="Ascensore" checked={elevator === true} onChange={handleCheckboxChange(setElevator)} />
            </div>
            <div className="toggle-group">
              <CheckBox label="Climatizzazione" checked={climate === true} onChange={handleCheckboxChange(setClimate)} />
            </div>
            <div className="toggle-group">
              <CheckBox label="Terrazzo" checked={terrace === true} onChange={handleCheckboxChange(setTerrace)} />
            </div>
            <div className="toggle-group">
              <CheckBox label="Portineria" checked={reception === true} onChange={handleCheckboxChange(setReception)} />
            </div>
          </div>
          <Button label="Filtra" defaultStyle="login" onClick={handleFilter}>
            Filtra
          </Button>
        </>
      )}
    </div>
  );
}
