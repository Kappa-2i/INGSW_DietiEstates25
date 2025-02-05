import React, { useEffect, useState } from "react";
import axios from "axios";
import InsertionCard from "../components/elements/InsertionCard"; // Importa la Card
import "./style/Home.css"; // Stile CSS

const Home = () => {
    const [insertions, setInsertions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInsertions = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/insertion/last");
                setInsertions(response.data.data);
            } catch (err) {
                console.error("Errore nel recupero delle inserzioni:", err);
                setError("Errore nel recupero delle inserzioni");
            }
        };
        fetchInsertions();
    }, []);

    return (
        <div className="home-container">
            <h2>Ultime Inserzioni</h2>
            {error && <p className="error">{error}</p>}
            <div className="card-container">
                {insertions.length > 0 ? (
                    insertions.map((insertion) => (
                        <InsertionCard key={insertion.id} insertion={insertion} />
                    ))
                ) : (
                    <p>Caricamento...</p>
                )}
            </div>
        </div>
    );
};

export default Home;
