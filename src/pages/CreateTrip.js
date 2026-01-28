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
               <Navbar/>

    <div className="create-wrapper">
      
      <div className="create-card">
        <h2>Create New Trip</h2>

        <input
          placeholder="Trip Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <input
          placeholder="Activities (comma separated)"
          value={activities}
          onChange={(e) => setActivities(e.target.value)}
        />

        <button onClick={handleCreate}>Create Trip</button>
      </div>
    </div>    
      <Footer/>
    </div>
  );
}
