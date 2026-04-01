import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div 
        className="navbar-brand" 
        onClick={() => navigate("/dashboard")} 
        style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px'}}
      >
        <img src={logo} className="logonav" alt="Nyora Logo" />
        <h1 className="navbar-title">TRAVEL PLANNER</h1>
      </div>

      {token && (
        <div className="navbar-links">
          <NavLink to="/dashboard" className="navbar-link">Dashboard</NavLink>
          <NavLink to="/create-trip" className="navbar-link">Create Trip</NavLink>
          <NavLink to="/chat" className="navbar-link">Chat</NavLink>
          <NavLink to="/contact" className="navbar-link">Contact</NavLink>
          <NavLink to="/about" className="navbar-link">About</NavLink>
          
          <button onClick={handleLogout} className="navbar-btn">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}