import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../elements/navbar/navbar';
import CardAgent from '../../elements/AgentCard/AgentCard';
import './YourAgents.scss';

const YourAgents = () => {
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/user/myagent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgents(response.data.data);
      } catch (err) {
        console.error("Errore nel recupero degli agenti:", err);
        setError("Errore nel recupero degli agenti");
      }
    };

    if (token) {
      fetchAgents();
    }
  }, [token]);

  return (
    <div className="your-agents-page">
      <Navbar />
      <h2 className="page-title">I Tuoi Agenti</h2>
      <div className="agents-container">
        {error && <p className="error">{error}</p>}
        {agents && agents.length > 0 ? (
          agents.map((agent) => (
            <CardAgent key={agent.id} agent={agent} />
          ))
        ) : (
          <p className="no-results">Nessun agente trovato</p>
        )}
      </div>
    </div>
  );
};

export default YourAgents;
