import React, { useEffect, useState } from "react";
import axios from "axios";
import InsertionCard from "../../elements/insertionCard/InsertionCard"; // Importa la Card
import "./Home.scss"; 
import Navbar from "../../elements/navbar/navbar";

const Home = () => {
    const [insertions, setInsertions] = useState([]);
    const [error, setError] = useState(null);
    //const [userName, setUserName] = useState('')
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
        <div className="home-page-wrapper">
            <div>
                <Navbar />
            </div>

            <div className="last__insertions"><h2>Ultime Inserzioni</h2></div>
            
            {error && <p className="error">{error}</p>}
            <div className="insertion-card-wrapper">
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
