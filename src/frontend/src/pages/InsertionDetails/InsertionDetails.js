import React, { useState, useEffect } from "react";
import axios from "axios";
import MapComponent from "../../elements/mapComponent/MapComponent";
import { useParams } from "react-router-dom";

const InsertionDetails = () => {
    const { insertionId } = useParams();
    console.log(insertionId);
    const [insertion, setInsertion] = useState(null);
    const [pois, setPois] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("restaurant"); // Default: ristoranti

    // Funzione per ottenere i dettagli dell'inserzione
    useEffect(() => {
        const fetchInsertionDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/insertion/${insertionId}`);
                console.log(response.data.data);
                setInsertion(response.data.data);
            } catch (error) {
                console.error("Errore nel recupero dell'inserzione:", error);
            }
        };

        fetchInsertionDetails();
    }, [insertionId]);

    // Funzione per ottenere i POI basati sulla categoria selezionata
    const fetchPOIs = async (category) => {
        try {
            console.log("InsertionId: ",insertionId);
            console.log("Category: ", category);
            const response = await axios.get(`http://localhost:8000/api/insertion/${insertionId}/pois?category=${category}`);
            console.log("POIS RICEVUTI", response.data.pois);
            setPois(response.data.pois);
            console.log("POIS SETTATI:", pois);
        } catch (error) {
            console.error("Errore nel recupero dei POI:", error);
        }
    };

    // Cambia la categoria e aggiorna i POI
    const handleCategoryChange = (event) => {
        const newCategory = event.target.value;
        setSelectedCategory(newCategory);
        fetchPOIs(newCategory);
    };

    return (
        <div>
            <h1>Dettagli Inserzione</h1>
            {insertion ? (
                <div>
                    <h2>{insertion.title}</h2>
                    <p>Camere: {insertion.room}</p>
                    <p>Bagni: {insertion.bathroom}</p>
                    <p>Prezzo: {insertion.price}</p>

                    {/* 🔽 ComboBox per scegliere la categoria dei POI */}
                    <label>Seleziona categoria di interesse:</label>
                    <select value={selectedCategory} onChange={handleCategoryChange}>
                        <option>Seleziona Categoria</option>
                        <option value="Ristorante">Ristoranti</option>
                        <option value="Mezzi di Trasporto">Mezzi di Trasporto</option>
                        <option value="Supermercato">Supermercati</option>
                        <option value="Farmacia">Farmacie</option>
                    </select>

                    {/* Mappa con i POI */}
                    <MapComponent insertion={insertion} pois={pois} />
                </div>
            ) : (
                <p>Caricamento...</p>
            )}
        </div>
    );
};

export default InsertionDetails;
