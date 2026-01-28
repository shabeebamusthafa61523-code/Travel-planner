import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/about.css";

export default function About() {
  return (
    <div className="bg">
    <Navbar/>
    <div className="about-page">
      <h1>About Travel Planner 🌍</h1>

      <p className="about-intro">
        Travel Planner helps you organize trips, discover nearby tourist places,
        and create smart itineraries — all in one place.
      </p>

      <div className="about-sections">
        <div className="about-card">
          <h3>✈️ What We Do</h3>
          <p>
            We help travelers plan trips easily by showing weather, nearby
            attractions, maps, and suggested itineraries.
          </p>
        </div>

        <div className="about-card">
          <h3>🧠 Smart Features</h3>
          <ul>
            <li>Trip planning & tracking</li>
            <li>Nearby tourist places</li>
            <li>Map & weather integration</li>
            <li>Day-wise itinerary suggestions</li>
          </ul>
        </div>

        <div className="about-card">
          <h3>🌴 Made for Travelers</h3>
          <p>
            Whether it’s a weekend getaway or a long vacation, Travel Planner
            helps you plan smarter and travel better.
          </p>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
}
