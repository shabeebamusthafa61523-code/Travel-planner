import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/tripcard.css";

export default function TripCard({ trip }) {
  const navigate = useNavigate();
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    if (!trip?.startDate) return;

    const calculateTime = () => {
      const diffMs = new Date(trip.startDate) - new Date();
      setDaysLeft(Math.max(Math.floor(diffMs / (1000 * 60 * 60 * 24)), 0));
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000 * 60 * 60); // Update hourly
    return () => clearInterval(interval);
  }, [trip.startDate]);

  const formatDate = (date) => {
    if (!date) return "Not set";
    const d = new Date(date);
    return isNaN(d) ? "Not set" : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  const isToday = () => {
    if (!trip?.startDate) return false;
    return new Date().toDateString() === new Date(trip.startDate).toDateString();
  };

  return (
    <div className="trip-card" onClick={() => navigate(`/trip/${trip._id}`)}>
      <p className="destination">{trip.destination}</p>
      <h3>{trip.title}</h3>
      
      <div className="dates">
        {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
      </div>

      {trip.activities?.length > 0 && (
        <ul className="activities-list">
          {trip.activities.slice(0, 3).map((act, i) => (
            <li key={i}>{act}</li>
          ))}
          {trip.activities.length > 3 && <li>+{trip.activities.length - 3} more</li>}
        </ul>
      )}

      <div className="countdown">
        {isToday() ? "🎉 Today" : `⏳ ${daysLeft} Days Left`}
      </div>
    </div>
  );
}