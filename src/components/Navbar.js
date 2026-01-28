import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css"; // Import the CSS file
import logo from "../logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // redirect to login
  };

  return (
    <nav className="navbar">
      <img src={logo} className="logonav"></img>
      <h1 className="navbar-title">Smart Travel Planner</h1>

      {token && (
        <div className="navbar-links">
          <Link to="/dashboard" className="navbar-link">
            Dashboard
          </Link>
          <Link to="/create-trip" className="navbar-link">
            Create Trip
          </Link>
          <Link to="/chat" className="navbar-link"> Chat</Link>
          <Link to="/about" className="navbar-link">About Us</Link>
          <Link to="/contact" className="navbar-link">Contact</Link>

          <button onClick={handleLogout} className="navbar-btn">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
