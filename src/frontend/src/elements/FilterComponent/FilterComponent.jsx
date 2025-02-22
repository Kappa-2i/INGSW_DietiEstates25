import { useState } from "react";
import { /*Navigate,*/ useNavigate } from "react-router-dom";
import Select from "react-select";
import "./FilterComponent.scss";
import regionsData from '../../data/Italy.json';
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import CheckBox from "../../components/checkBox/CheckBox";
import Button from "../../components/button/Button";
import RangeSlider from "../../components/rangeSlider/RangeSlider";

const regionOptions = Object.keys(regionsData).map((regione) => ({ value: regione, label: regione }));

export default function FilterComponent() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [rooms, setRooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [balcony, setBalcony] = useState(0);
  const [energyclass, setEnergyClass] = useState("A");
  const [price, setPrice] = useState([10000, 1000000]);
  const [size, setSize] = useState([20, 2000]);
  const [garage, setGarage] = useState(false);
  const [garden, setGarden] = useState(false);
  const [elevator, setElevator] = useState(false);
  const [climate, setClimate] = useState(false);
  const [terrace, setTerrace] = useState(false);
  const [reception, setReception] = useState(false);


  const provinceOptions = selectedRegion ? regionsData[selectedRegion.value].map((province) => ({ value: province, label: province })) : [];


  const handleFilter = async () => {
    const filters = {
      region: selectedRegion ? selectedRegion.value : null, 
      municipality: selectedProvince ? selectedProvince.value : null,
      price: price[0],
      /*room: Number(rooms),
      bathroom: Number(bathrooms),
      balcony: Number(balcony),
      energyclass,
      
      surface: size[0],
      garage,
      garden,
      elevator,
      climate,
      terrace,
      reception*/
    };

    try {
      navigate(`/filteredSearch?ts=${new Date().getTime()}`, { state: filters });


        
    } catch (error) {
        console.error("Errore nel filtraggio:", error);
    }
  };

  return (
    <div className="filter-container">
      <h2 className="title">Filtri di Ricerca</h2>
      <div className="filters">
        <Select options={regionOptions} placeholder="Regione" onChange={setSelectedRegion} className="select" />
        <Select options={provinceOptions} placeholder="Provincia" onChange={setSelectedProvince} className="select" isDisabled={!selectedRegion} />
        <div className="select-group">
          <div className="input-group">
            <CustomSelect
              label="Stanza"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              defaultStyle="dropdown"
            >
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </CustomSelect>
          </div>
          <div className="input-group">
            <CustomSelect
                label="Bagni"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                defaultStyle="dropdown"
              >
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </CustomSelect>
            </div>
            <div className="input-group">
              <CustomSelect
                label="Balconi"
                value={balcony}
                onChange={(e) => setBalcony(e.target.value)}
                defaultStyle="dropdown"
              >
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </CustomSelect>
            </div>
            <div className="input-group">
              <CustomSelect
                label="Classe Energetica"
                value={energyclass}
                onChange={(e) => setEnergyClass(e.target.value)}
                defaultStyle="dropdown"
              >
                {["G", "F", "E", "D", "C", "B", "A", "A2", "A3", "A4"].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </CustomSelect>
            </div>
        </div>
        <div className="range-group">
          <RangeSlider
              label="Prezzo Massimo"
              min={10000}
              max={1000000}
              value={price}
              onChange={setPrice}
              unit="$"
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
            <CheckBox label="Garage" checked={garage} onChange={() => setGarage(!garage)} />
          </div>
          <div className="toggle-group">
            <CheckBox label="Giardino" checked={garden} onChange={() => setGarden(!garden)} />
          </div>
          <div className="toggle-group">
            <CheckBox label="Ascensore" checked={elevator} onChange={() => setElevator(!elevator)} />
          </div>
          <div className="toggle-group">
            <CheckBox label="Climatizzazione" checked={climate} onChange={() => setClimate(!climate)} />
          </div>
          <div className="toggle-group">
            <CheckBox label="Terrazzo" checked={terrace} onChange={() => setTerrace(!terrace)} />
          </div>
          <div className="toggle-group">
            <CheckBox label="Portineria" checked={reception} onChange={() => setReception(!reception)} />
          </div>
        </div>
        <Button label="Filtra" defaultStyle="login" onClick={handleFilter}>
          Filtra
        </Button>
      </div>
    </div>
  );
}
