import React, { useState } from "react";
import "./CreateInsertionForm.scss";
import CheckBox from "../../components/checkBox/CheckBox";
import Select from "react-select";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import Input from "../../components/input/Input";

//FILE JSON
import regionsData from "../../data/gi_regioni.json";
import provincesData from "../../data/gi_province.json";
import municipalitiesData from "../../data/gi_comuni.json";


const CreateInsertionForm = () => {
    const [selectedRegion, setSelectedRegion] = useState();
    const [selectedProvince, setSelectedProvince] = useState();
    const [selectedMunicipality, setSelectedMunicipality] = useState(); 
    const [title, setTitle] = useState("");
    const [prezzo, setPrezzo] = useState("");
    const [superficie, setSuperficie] = useState("");
    const [camere, setCamere] = useState("");
    const [bagni, setBagni] = useState("");
    const [address, setAddress] = useState("");
    const [piano, setPiano] = useState("");
    const [energyclass, setEnergyClass] = useState("B");
    const [category, setCategory] = useState({ value: "Affitto", label: "Affitto" });
    const [balcony, setBalcony] = useState("");
    const [garage, setGarage] = useState(false);
    const [garden, setGarden] = useState(false);
    const [elevator, setElevator] = useState(false);
    const [climate, setClimate] = useState(false);
    const [reception, setReception] = useState(false);
    const [terrace, setTerrace] = useState(false);

    const categoriaOptions = [
        { value: "Affitto", label: "Affitto" },
        { value: "Vendita", label: "Vendita" },
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

    const handleChange = (setter) => (e) => {
        setter(e.target.type === "checkbox" ? e.target.checked : e.target.value);
    };

  return (
    <div className="real-estate-form">
      <div className="photo-upload">
        <button className="upload-button">+ Aggiungi Foto</button>
      </div>
        <div className="form-fields">

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

            <div className="title">
                <Input 
                    defaultStyle="input-style"
                    defaultStyleWrapper="title-wrapper"
                    type="email" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Titolo"
                    required 
                />
            </div>


            <textarea
                className="description"
                placeholder="Descrizione"
                maxLength={500} 
            />

            <div className="input-group">
              <CustomSelect
                label="Classe Energetica"
                value={energyclass}
                onChange={(e) => setEnergyClass(e.target.value)}
                defaultStyle="dropdown"
              >
                {["G", "F", "E", "D", "C", "B", "A", "A2", "A3", "A4"].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </CustomSelect>
            </div>
            <input type="number" placeholder="Prezzo" onChange={handleChange(setPrezzo)} />
            <input type="number" placeholder="Superficie" onChange={handleChange(setSuperficie)} />
            <input type="number" placeholder="Camere" onChange={handleChange(setCamere)} />
            <input type="number" placeholder="Bagni" onChange={handleChange(setBagni)} />
            <input type="text" placeholder="Indirizzo" onChange={handleChange(setAddress)} />
            <input type="text" placeholder="Piano" onChange={handleChange(setPiano)} />
            <input type="text" placeholder="Balconi" onChange={handleChange(setBalcony)} />
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
            <div className="buttons">
            <button className="cancel">Annulla</button>
            <button className="continue">Continua</button>
            </div>
        </div>
    </div>
  );
};

export default CreateInsertionForm;
