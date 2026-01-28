import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/Api";

export default function TripCard({ trip }) {
  const navigate = useNavigate();
  // const [daysLeft, setDaysLeft] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(trip.startDate) - new Date();
      setTimeLeft(Math.max(Math.ceil(diff / (1000*60*60*24)), 0));
    }, 1000*60*60); // update every hour
    return () => clearInterval(interval);
  }, [trip.startDate]);

  const handleCardClick = () => navigate(`/trip/${trip._id}`);
const formatDate = (date) => {
  if (!date) return "Not set";
  const d = new Date(date);
  return isNaN(d) ? "Not set" : d.toLocaleDateString();
};
 const isToday = () => {
  if (!trip?.startDate) return false;
  const today = new Date();
  const start = new Date(trip.startDate);
  return today.toDateString() === start.toDateString();
};


useEffect(() => {
  if (!trip?.startDate) return;

  const interval = setInterval(() => {
    const diffMs = new Date(trip.startDate) - new Date();

    if (diffMs <= 0) {
      setTimeLeft({ days: 0});
      return;
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    setTimeLeft({ days });
  }, 1000);
return () => clearInterval(interval);
}, [trip])

  return (
    <div className="trip-card" onClick={handleCardClick}>
      <h3>{trip.title}</h3>
      <p className="destination">{trip.destination}</p>
      <p className="dates">
<p>
  <strong>Dates:</strong> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
</p>
      </p>
 <p className="countdown">
  {isToday()
    ? "🎉 Trip is today!"
    : ` ${timeLeft.days}days left `}
</p>      {trip.activities && trip.activities.length > 0 && (
        <ul className="activities-list">
          {trip.activities.map((act, i) => (
            <li key={i}>{act}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
