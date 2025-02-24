import React from 'react';
import './AgentCard.scss';

const AgentCard = ({ agent }) => {

  return (
    <div className="card-agent">
      <h3>{agent.first_name} {agent.last_name}</h3>
      <p><strong>Email:</strong> {agent.email}</p>
      <p><strong>Telefono:</strong> {agent.phone}</p>
      <p><strong>Ruolo:</strong> {agent.role}</p>
    </div>
  );
};

export default AgentCard;
