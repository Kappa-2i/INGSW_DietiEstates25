import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Navbar from "../../elements/navbar/navbar";
import GalleryInsertion from "../../elements/GalleryInsertion/GalleryInsertion";
import InsertionSummary from "../../elements/InsertionSummary/InsertionSummary";
import DescriptionInsertion from "../../elements/DescriptionInsertion/DescriptionInsertion";
import DetailsSurfaceInsertion from "../../elements/DetailsSurfaceInsertion/DetailsSurfaceInsertion";
import AdditionalFeatures from "../../elements/AdditionalFeatures/AdditionalFeatures";
import MapElement from "../../elements/MapElement/MapElement";
import HistoryOffer from "../../elements/HistoryOffer/HistoryOffer";

import "./InsertionDetails.scss";

const InsertionDetails = () => {
  const { insertionId } = useParams();
  const [insertion, setInsertion] = useState(null);

  useEffect(() => {
    const fetchInsertionDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/insertion/${insertionId}`);
        setInsertion(response.data.data);
      } catch (error) {
        console.error("Errore nel recupero dell'inserzione:", error);
      }
    };

    fetchInsertionDetails();
  }, [insertionId]);

  if (!insertion) {
    return <p>Caricamento...</p>;
  }

  return (
    <div className="insertion-details-page">
      <Navbar />
      <div className="insertion-details-grid">
        {/* Riga 1: Colonna sinistra: gallery; colonna destra: summary */}
        <div className="gallery-area">
          <GalleryInsertion images={insertion.image_url} />
        </div>
        <div className="summary-area">
          <InsertionSummary 
            title={insertion.title} 
            price={insertion.price} 
            agentId={insertion.userid}
            province={insertion.province} 
            municipality={insertion.municipality}
            insertionId={insertion.id}
          />
          <HistoryOffer insertionId={insertion.id} />
        </div>

        {/* Riga 2: Descrizione su tutta la larghezza */}
        <div className="description-area">
          <DescriptionInsertion description={insertion.description} />
        </div>

        {/* Riga 3: Colonna sinistra: dettagli superficie; colonna destra: mappa */}
        <div className="details-area">
          <DetailsSurfaceInsertion 
            surface={insertion.surface} 
            floor={insertion.floor} 
            energyClass={insertion.energyclass}
            rooms={insertion.room} 
            bathrooms={insertion.bathroom} 
            balconies={insertion.balcony} 
            contract={insertion.contract}
          />
        </div>
        <div className="map-area">
          <MapElement insertion={insertion} />
        </div>

        {/* Riga 4: Colonna sinistra: caratteristiche aggiuntive; colonna destra: (mappa già occupa lo spazio) */}
        <div className="additional-area">
          <AdditionalFeatures 
            garage={insertion.garage}
            terrace={insertion.terrace}
            garden={insertion.garden}
            elevator={insertion.elevator}
            climate={insertion.climate}
            reception={insertion.reception}
          />
        </div>
        {/* La cella "map-area" viene fatta span su le righe 3 e 4 */}
      </div>
    </div>
  );
};

export default InsertionDetails;
