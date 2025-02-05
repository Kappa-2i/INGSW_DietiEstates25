import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Register from "./pages/Register";
import Home from "./pages/Home";
import InsertionDetails from "./pages/InsertionDetails";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register/>} />
                <Route path="/insertion/:insertionId" element={<InsertionDetails/>} />
            </Routes>
        </Router>
    );
};

export default App;
