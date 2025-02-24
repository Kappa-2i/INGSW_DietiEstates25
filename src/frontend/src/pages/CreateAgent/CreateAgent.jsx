import React from "react";
import Navbar from "../../elements/navbar/navbar";
import CreateAgentForm from "../../elements/CreateAgentForm/CreateAgentForm";
import "./CreateAgent.scss";
import { useLocation } from "react-router-dom";

const CreateAgent = () => {
const location = useLocation();
const { userRole } = location.state; 



  return (
    <div className="create-agent-page">
      <Navbar />
      <div className="create-agent-content">
        <CreateAgentForm userRole={userRole} />
      </div>
    </div>
  );
};

export default CreateAgent;
