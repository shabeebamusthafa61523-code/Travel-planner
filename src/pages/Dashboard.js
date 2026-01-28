import { useEffect, useState } from "react";
import API from "../services/Api";
import TripCard from "../components/Tripcard";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import CommonChat from "./CommonChat";
import Footer from "../components/Footer";

// ChatBox Component
function ChatBox({ chatMessages, onSend }) {
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const chatContainer = document.querySelector(".chat-messages");
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [chatMessages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSend(newMessage);
    setNewMessage("");
  };

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {chatMessages.map((m, i) => (
          <div key={i} className="chat-message">
            <strong>{m.user}:</strong> {m.text}{" "}
            <span className="chat-time">{m.time}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, past: 0 });
  const [chatMessages, setChatMessages] = useState([]); // Global chat
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await API.get("/trips");
        setTrips(res.data);
        calculateStats(res.data);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) navigate("/");
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

  const handleSendMessage = (msg) => {
    const message = {
      user: "You",
      text: msg,
      time: new Date().toLocaleTimeString(),
    };
    setChatMessages((prev) => [...prev, message]);
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <div className="dashboard-header">
        <h2>Your Trips</h2>
        <button className="create-btn" onClick={() => navigate("/create-trip")}>
          + Create New Trip
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        {["total", "upcoming", "past"].map((type) => (
          <div key={type} className={`stat-card ${type}`}>
            <h3>{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
            <p className="stat-number">{stats[type]}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${getProgress(stats[type])}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Trips Grid */}
      <div className="trip-grid">
        {trips.length > 0 ? (
          trips.map((trip) => <TripCard key={trip._id} trip={trip} />)
        ) : (
          <p className="empty-text">You have no trips yet. Create one now!</p>
        )}
      </div>

      {/* Global Group Chat */}
      <Footer/>
    </div>
  );
}
