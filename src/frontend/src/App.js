import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from './pages/Login/Login';
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

function ResultSearchWrapper() {
    const location = useLocation();
    const filters = location.state || {}; // Ottieni i filtri dallo state della navigazione
    console.log("ResultFilter:", filters);
    return <ResultSearch key={JSON.stringify(filters)} filters={filters} />;
}

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register/>} />
                <Route path="/auth/success" element={<AuthSuccess />} />
                <Route path="/insertion/:insertionId" element={<InsertionDetails/>} />
                <Route path="/profile" element={<UserProfile/>} />
                <Route path="/favorites" element={<Favorites/>} />
                <Route path="/offers" element={<Offer/>} />
                <Route path='/search/:activeSection/:searchTerm' element={<ResultSearch />} />
                <Route path='/filtered-search' element={<ResultSearchWrapper />} />
                <Route path='/create-agent' element={<CreateAgent />} />
                <Route path='/your-agents' element={<YourAgents />} />
                <Route path='/your-insertions' element={<YourInsertions />} />
            </Routes>
        </Router>
    );
};

export default App;
