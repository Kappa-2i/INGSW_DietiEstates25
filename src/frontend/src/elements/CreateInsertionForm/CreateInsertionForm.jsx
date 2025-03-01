import React, { useState } from "react";
import "./CreateInsertionForm.scss";
import CheckBox from "../../components/checkBox/CheckBox";
import Select from "react-select";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import Input from "../../components/input/Input";
import NumberInput from "../../components/NumberInput/NumberInput";

//FILE JSON
import regionsData from "../../data/gi_regioni.json";
import provincesData from "../../data/gi_province.json";
import municipalitiesData from "../../data/gi_comuni.json";


const CreateInsertionForm = () => {
    const [selectedRegion, setSelectedRegion] = useState();
    const [selectedProvince, setSelectedProvince] = useState();
    const [selectedMunicipality, setSelectedMunicipality] = useState(); 
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [surface, setSurface] = useState("");
    const [room, setRoom] = useState(null);
    const [bathroom, setBathroom] = useState(null);
    const [floor, setFloor] = useState(null);
    const [balcony, setBalcony] = useState(null);
    const [address, setAddress] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [cap, setCap] = useState("");
    const [energyclass, setEnergyClass] = useState(null);
    const [category, setCategory] = useState({ value: "Affitto", label: "Affitto" });
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


    const energyClassOptions = [
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

    const camereOptions = Array.from({ length: 10 }, (_, i) => ({
      value: i + 1,
      label: `${i + 1} Camere`,
    }));
    
    const bagniOptions = Array.from({ length: 10 }, (_, i) => ({
      value: i + 1,
      label: `${i + 1} Bagni`,
    }));
    
    const pianoOptions = [
      { value: "piano_terra", label: "Piano Terra" },
      { value: "1", label: "1° Piano" },
      { value: "2", label: "2° Piano" },
      { value: "3", label: "3° Piano" },
      { value: "altro", label: "Altro" },
    ];

    const balconiOptions = Array.from({ length: 6 }, (_, i) => ({
      value: i,
      label: i === 0 ? "Nessun Balcone" : `${i} Balcon${i > 1 ? 'i' : 'e'}`,
    }));

    // Funzione per stampare i valori dei campi
    const handleSubmit = () => {
      if (!title || !price || !surface || !room || !bathroom || !floor || !address || !energyclass || !category || !selectedRegion || !selectedProvince || !selectedMunicipality) {
          alert("Tutti i campi obbligatori devono essere compilati!");
          return;
      }
      
      const formData = {
          title, price, surface, room, bathroom, floor, balcony,
          address, energyclass, category, selectedRegion,
          selectedProvince, selectedMunicipality, garage, garden, elevator, climate, reception, terrace
      };
      
      console.log("Dati del Form:", formData);
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
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Titolo"
                    required 
                />
            </div>

            <div className="title">
                <Input 
                    defaultStyle="input-style"
                    defaultStyleWrapper="title-wrapper" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder="Indirizzo"
                    required 
                />
            </div>
            
            <NumberInput
              value={houseNumber}
              onChange={setHouseNumber} 
              placeholder="Civico"
            />
            
            <NumberInput
              value={cap}
              onChange={setCap} 
              placeholder="Cap"
            />

            <div className="description-wrapper">
              <textarea
                  className="description"
                  placeholder="Descrizione"
                  maxLength={500} 
              />
            </div>

            <NumberInput
              value={price}
              onChange={setPrice} // Usa setSurface direttamente, senza una funzione intermediaria
              placeholder="Prezzo"
              unit="€"
            />
            
            <NumberInput
              value={surface}
              onChange={setSurface} // Usa setSurface direttamente, senza una funzione intermediaria
              placeholder="Superfice"
              unit="m²"
            />


            <Select
              options={energyClassOptions}
              value={energyclass ? { value: energyclass, label: energyclass } : null}
              onChange={(selectedOption) => setEnergyClass(selectedOption.value)}
              placeholder="Seleziona Classe Energetica"
              className="select"
            />

            <Select
              options={camereOptions}
              value={room}
              onChange={setRoom}
              placeholder="Seleziona Camere"
              className="select"
            />

            <Select
              options={bagniOptions}
              value={bathroom}
              onChange={setBathroom}
              placeholder="Seleziona Bagni"
              className="select"
            />

            <Select
              options={pianoOptions}
              value={floor}
              onChange={setFloor}
              placeholder="Seleziona Piano"
              className="select"
            />

            <Select
              options={balconiOptions}
              value={balcony}
              onChange={setBalcony}
              placeholder="Seleziona Balcone"
              className="select"
            />

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
                <button 
                  className="continue" 
                  onClick={handleSubmit} // Aggiungi il click handler
                >
                  Continua
                </button>
            </div>
        </div>
    </div>
  );
};

export default CreateInsertionForm;
