import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import InsertionDetails from "./pages/InsertionDetails/InsertionDetails";
import UserProfile from "./pages/UserProfile/UserProfile";
import Favorites from "./pages/Favorites/Favorites";
import Offer from "./pages/Offers/Offer";
import AuthSuccess from "./pages/AuthSuccess/AuthSuccess";
import ResultSearch from "./pages/ResultSearch/ResultSearch";
import CreateAgent from "./pages/CreateAgent/CreateAgent";
import YourAgents from "./pages/YourAgents/YourAgents";
import YourInsertions from "./pages/YourInsertions/YourInsertions";
import AddInsertion from "./pages/AddInsertion/AddInsertion";
import OfferInsertion from "./pages/OfferInsertion/OfferInsertion";
import Loader from "./elements/Loader/Loader";

function ResultSearchWrapper() {
  const location = useLocation();
  const filters = location.state || {}; // Ottieni i filtri dallo state della navigazione
  console.log("ResultFilter:", filters);
  return <ResultSearch key={JSON.stringify(filters)} filters={filters} />;
}

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula un breve ritardo per mostrare il loader, ad esempio 500ms
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
        <Route path="/insertion/:insertionId" element={<InsertionDetails />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/offers" element={<Offer />} />
        <Route path="/search/:activeSection/:searchTerm" element={<ResultSearch />} />
        <Route path="/filtered-search" element={<ResultSearchWrapper />} />
        <Route path="/create-agent" element={<CreateAgent />} />
        <Route path="/your-agents" element={<YourAgents />} />
        <Route path="/your-insertions" element={<YourInsertions />} />
        <Route path="/add-insertions" element={<AddInsertion />} />
        <Route path="/offers/insertion/:insertionId" element={<OfferInsertion />} />
      </Routes>
    </Router>
  );
};

export default App;
