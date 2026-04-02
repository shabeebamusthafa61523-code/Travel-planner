import { useEffect, useState } from "react";
import API from "../services/Api";
import TripCard from "../components/Tripcard";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, past: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await API.get("/api/trips");
        setTrips(res.data);
        calculateStats(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) navigate("/");
      }
    };
    fetchTrips();
  }, [navigate]);

  const calculateStats = (trips) => {
    const today = new Date();
    const upcoming = trips.filter((t) => new Date(t.startDate) >= today).length;
    const past = trips.filter((t) => new Date(t.endDate) < today).length;
    setStats({ total: trips.length, upcoming, past });
  };

  const getProgress = (count) => {
    if (stats.total === 0) return 0;
    return Math.round((count / stats.total) * 100);
  };
return (
  <div className="dashboard-wrapper">
    <Navbar />
    
    <div className="content-container">
      <header className="dashboard-header">
        <div>
          <h2>Adventure Dashboard</h2>
          <p style={{ color: '#64748b', fontWeight: '500', marginTop: '8px' }}>
            Welcome back! Where to next?
          </p>
          <NavLink to="/chat" className="explorer-link-minimal">
      Connect with Explorers →
    </NavLink>
        </div>
        <button className="create-btn" onClick={() => navigate("/create-trip")}>
          + Plan New Journey
        </button>
      </header>

      <section className="stats-cards">
        {["total", "upcoming", "past"].map((type) => (
          <div key={type} className={`stat-card ${type}`}>
            <h3>{type} Journeys</h3>
            <p className="stat-number">{stats[type]}</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${getProgress(stats[type])}%`,
                  background: type === 'past' ? '#e2b04a' : type === 'upcoming' ? '#1b6b7a' : '#0f172a'
                }} 
              />
            </div>
          </div>
        ))}
      </section>

      <div className="trip-grid">
        {trips.length > 0 ? (
          trips.map((trip) => <TripCard key={trip._id} trip={trip} />)
        ) : (
          <div className="empty-state-card" style={{ textAlign: 'center', padding: '40px' }}>
             <p style={{ color: '#64748b' }}>Your passport is feeling empty. Let's add a trip!</p>
          </div>
        )}
      </div>
    </div>

    <Footer/>
  </div>
);
}