import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateInsertionForm.scss";
import CheckBox from "../../components/checkBox/CheckBox";
import Select from "react-select";
import Input from "../../components/input/Input";
import NumberInput from "../../components/NumberInput/NumberInput";
import Button from "../../components/button/Button";
import ImageUpload from "../../components/ImageUpload/ImageUpload";

//FILE JSON
import regionsData from "../../data/gi_regioni.json";
import provincesData from "../../data/gi_province.json";
import municipalitiesData from "../../data/gi_comuni.json";
import capData from "../../data/comuni.json";




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
    const [cap, setCap] = useState();
    const [energyclass, setEnergyClass] = useState(null);
    const [category, setCategory] = useState({ value: "BUY", label: "Vendita" });
    const [garage, setGarage] = useState(false);
    const [garden, setGarden] = useState(false);
    const [elevator, setElevator] = useState(false);
    const [climate, setClimate] = useState(false);
    const [reception, setReception] = useState(false);
    const [terrace, setTerrace] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [description, setDescription] = useState("");

    const navigate = useNavigate();

    const categoriaOptions = [
      { value: "BUY", label: "Vendita" },
      { value: "RENT", label: "Affitto" }, 
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

    const capOptions = selectedMunicipality 
    ? capData
      .filter((cap) => cap.nome.toLowerCase() === selectedMunicipality.label.toLowerCase())
      .flatMap((cap) =>
        cap.cap.map((c) => ({
          value: c,
          label: c,
        }))
      )
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
      { value: "0", label: "Piano Terra" },
      { value: "1", label: "1° Piano" },
      { value: "2", label: "2° Piano" },
      { value: "3", label: "3° Piano" },
      { value: "4", label: "4° Piano" },
      { value: "5", label: "5° Piano" },
    ];

    const balconiOptions = Array.from({ length: 6 }, (_, i) => ({
      value: i,
      label: i === 0 ? "Nessun Balcone" : `${i} Balcon${i > 1 ? 'i' : 'e'}`,
    }));


    // Funzione per stampare i valori dei campi
    const handleSubmit = async () => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price.replace('.', ''));
      formData.append("surface", surface);
      formData.append("room", room ? room.value : "");
      formData.append("bathroom", bathroom ? bathroom.value : "");
      formData.append("floor", floor ? floor.value : "");
      formData.append("balcony", balcony ? balcony.value : "");
      formData.append("address", address);
      formData.append("energyclass", energyclass);
      formData.append("contract", category.value);
      formData.append("region", selectedRegion ? selectedRegion.label : "");
      formData.append("province", selectedProvince ? selectedProvince.label : "");
      formData.append("municipality", selectedMunicipality ? selectedMunicipality.label : "");
      formData.append("garage", garage);
      formData.append("garden", garden);
      formData.append("elevator", elevator);
      formData.append("climate", climate);
      formData.append("reception", reception);
      formData.append("terrace", terrace);
      formData.append("cap", cap);
      formData.append("house_number", houseNumber);
      formData.append("description", description);

      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      // Log the FormData to see if it contains all values correctly
      for (let pair of formData.entries()) {
          console.log(pair[0] + ": " + pair[1]);
      }
  
      try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/insertion/creation`, formData, {
              headers: {
                  "Content-Type": "multipart/form-data", // FormData expects this header
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
          });
  
          if (response.data.success) {
              console.log("Inserzione creata con successo:", response.data.data);
              alert("Inserzione creata con successo!");
              navigate("/");
          } else {
              console.error("Errore durante la creazione dell'inserzione:", response.data.message);
              alert("Errore durante la creazione dell'inserzione.");
          }
      } catch (error) {
        console.error("Error:", error.message);
        // Se la response contiene errori di validazione
        if (error.response && error.response.data && error.response.data.errors) {
          const errorMessages = error.response.data.errors
            .map(err => err.msg)
            .join("\n");
          alert(errorMessages);
        } else {
          alert("Errore interno del server. Per favore riprova più tardi.");
        }
      }
    };
  
    
    

  return (
    <div className="real-estate-form">
      <div className="photo-upload">
        <ImageUpload onImagesChange={setSelectedImages} />
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
                            setCap(null);
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
                            setCap(null);
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
            
            <div className="address-wrapper">
              <NumberInput
                value={houseNumber}
                onChange={setHouseNumber} 
                placeholder="Civico"
                isHouseNumber={true}
              />
              {console.log(capOptions)}
              <Select 
                options={capOptions} 
                placeholder="CAP" 
                onChange={(selected) => setCap(selected.value)}
                className="select" 
                isDisabled={!selectedMunicipality}
                value={cap ? cap.value : null}
              />
            </div>


            <div className="description-wrapper">
              <textarea
                  className="description"
                  placeholder="Descrizione"
                  maxLength={500} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                <Button 
                  label="Annulla"
                  type="submit" 
                  defaultStyle="cancel-style"
                  onClick={() => navigate("/")}/>
                <Button 
                  label="Conferma" 
                  type="submit" 
                  defaultStyle="search-style"
                  onClick={handleSubmit} />
            </div>
        </div>
    </div>
  );
};

export default CreateInsertionForm;
