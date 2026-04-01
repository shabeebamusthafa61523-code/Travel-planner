import { useState } from "react";
import API from "../services/Api";
import "../styles/createtrip.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";


export default function CreateTrip() {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activities, setActivities] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      await API.post("/trips", {
        title,
        destination,
        startDate,
        endDate,
        activities: activities
          ? activities.split(",").map((a) => a.trim())
          : [],
      });

      toast.success("Trip Created!");
              navigate("/dashboard"); // Redirect to login

      // reset form
      setTitle("");
      setDestination("");
      setStartDate("");
      setEndDate("");
      setActivities("");
    } catch (error) {
      toast.error("Failed to create trip");
    }
  };

  

  return (
    <div className="bg">
      <Navbar />

      <div className="create-wrapper">
        <div className="create-card">
          <h2>Plan Your Journey</h2>
          <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '14px' }}>
            Fill in the details to start your next adventure.
          </p>

          <label className="input-label">Trip Title</label>
          <input
            placeholder="e.g., Summer in Santorini"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="input-label">Destination</label>
          <input
            placeholder="e.g., Greece"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label className="input-label">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="input-label">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <label className="input-label">Activities</label>
          <input
            placeholder="Hiking, Dining, Sightseeing..."
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
          />

          <button onClick={handleCreate}>Create Trip</button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}