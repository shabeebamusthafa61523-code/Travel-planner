import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/Api";
import Navbar from "../components/Navbar";
import "../styles/tripdetails.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Footer from "../components/Footer";

// Fix default marker icon for Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    activities: "",
  });

  const [checkedActivities, setCheckedActivities] = useState([]);
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [suggestedItinerary, setSuggestedItinerary] = useState([]);

  const [activityCosts, setActivityCosts] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // LIVE EDIT STATES
  const [editCoords, setEditCoords] = useState(null);
  const [editNearbyPlaces, setEditNearbyPlaces] = useState([]);
  const [editItinerary, setEditItinerary] = useState([]);

  // Mock activity costs
  useEffect(() => {
    if (trip?.activities?.length) {
      const costs = trip.activities.map((a) => ({
        activity: a,
        cost: Math.floor(Math.random() * 3000) + 500, // INR
      }));
      setActivityCosts(costs);
    }
  }, [trip]);

  const totalCost = activityCosts.reduce((sum, a) => sum + a.cost, 0);

  // SIMPLE CHAT (mock)
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      user: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString(),
    };
    setChatMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  // 🔹 Fetch trip details
  const fetchTrip = async () => {
    try {
      const res = await API.get(`/trips/${id}`);
      const data = res.data;

      setTrip(data);
      setFormData({
        title: data.title || "",
        destination: data.destination || "",
        startDate: data.startDate ? data.startDate.slice(0, 10) : "",
        endDate: data.endDate ? data.endDate.slice(0, 10) : "",
        activities: data.activities?.join(", ") || "",
      });

      setCheckedActivities(new Array(data.activities?.length || 0).fill(false));

      if (data.destination) fetchWeather(data.destination);
      if (data.destination) fetchCoordinates(data.destination);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load trip.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  // 🔹 Weather
  const fetchWeather = async (city) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
      );
      const data = await res.json();
      if (data.cod === 200) setWeather(data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Map coordinates (main)
  const fetchCoordinates = async (city) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setCoords([lat, lon]);
        fetchNearbyPlacesGeoapify(lat, lon);
      }
    } catch (err) {
      console.error("Map error:", err);
    }
  };

  //using geoapify

 const fetchNearbyPlacesGeoapify = async (lat, lon) => {
  try {
    // const apiKey = process.env.REACT_APP_GEOAPIFY_KEY;
const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;

    if (!apiKey) {
      console.error("Geoapify API key missing");
      return;
    }

    const url = `https://api.geoapify.com/v2/places?categories=tourism.attraction,tourism.sights,leisure.park&filter=circle:${lon},${lat},10000&bias=proximity:${lon},${lat}&limit=20&apiKey=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok || !data.features) {
      console.error("Geoapify error:", data);
      setNearbyPlaces([]);
      setSuggestedItinerary([]);
      return;
    }

    const places = data.features.map((p) => ({
      name:
        p.properties.display_name ||
        p.properties.name ||
        p.properties.address_line1 ||
        "Tourist Place",
      lat: p.geometry.coordinates[1],
      lon: p.geometry.coordinates[0],
      category: p.properties.categories?.[0] || "Tourist Spot",
    }));

    console.log("Nearby places updated:", places);

    setNearbyPlaces(places);
    generateItineraryGeoapify(places, lat, lon);
  } catch (err) {
    console.error("Geoapify fetch error:", err);
    setNearbyPlaces([]);
    setSuggestedItinerary([]);
  }
};



  const generateItineraryGeoapify = (places, lat, lon) => {
  const placesWithDistance = places.map((place) => ({
    ...place,
    distance: getDistanceFromLatLonInKm(lat, lon, place.lat, place.lon) * 1000,
  }));

  const sorted = placesWithDistance.sort((a, b) => a.distance - b.distance);

  const itinerary = sorted.slice(0, 6).map((place, index) => ({
    day: Math.floor(index / 2) + 1,
    name: place.name,
    category: place.category,
    distance: place.distance,
  }));

  setSuggestedItinerary(itinerary);
};

useEffect(() => {
  console.log("Nearby places updated:", nearbyPlaces);
}, [nearbyPlaces]);


  // 🔹 Live Edit: Foursquare nearby places
  useEffect(() => {
    if (!formData.destination) {
      setEditCoords(null);
      setEditNearbyPlaces([]);
      setEditItinerary([]);
      return;
    }
    const delay = setTimeout(() => fetchEditCoordinates(formData.destination), 800);
    return () => clearTimeout(delay);
  }, [formData.destination]);

  const fetchEditCoordinates = async (city) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setEditCoords([lat, lon]);
        // fetchEditNearbyPlacesFoursquare(lat, lon);
      } else {
        setEditCoords(null);
        setEditNearbyPlaces([]);
        setEditItinerary([]);
      }
    } catch (err) {
      console.error("Edit map error:", err);
      setEditCoords(null);
      setEditNearbyPlaces([]);
      setEditItinerary([]);
    }
  };

//   const fetchEditNearbyPlacesFoursquare = async (lat, lon) => {
//     const radius = 5000;
//     const limit = 15;
//     try {
//       const res = await fetch(
//         `https://api.foursquare.com/v3/places/search?ll=${lat},${lon}&radius=${radius}&categories=16000&limit=${limit}`,
//         {
//           headers: {
//             Accept: "application/json",
//             Authorization: process.env.REACT_APP_FOURSQUARE_API_KEY,
//           },
//         }
//       );
//       const data = await res.json();

// if (!res.ok || !data.results) {
//   console.error("Foursquare API error:", data);
//   setNearbyPlaces([]);
//   setSuggestedItinerary([]);
//   return;
// }

// const places = data.results.map((place) => ({
//   name: place.name,
//   lat: place.geocodes?.main?.latitude,
//   lon: place.geocodes?.main?.longitude,
//   category: place.categories?.[0]?.name || "Tourist Spot",
// }));
// if (!res.ok || !data.results) {
//   console.error("Edit Foursquare API error:", data);
//   setEditNearbyPlaces([]);
//   setEditItinerary([]);
//   return;
// }

  //     setEditNearbyPlaces(places);
  //     const placesWithDistance = places.map((place) => ({
  //       ...place,
  //       distance: getDistanceFromLatLonInKm(lat, lon, place.lat, place.lon) * 1000,
  //     }));
  //     const sorted = placesWithDistance.sort((a, b) => a.distance - b.distance);
  //     const itinerary = sorted.slice(0, 6).map((place, index) => ({
  //       day: Math.floor(index / 2) + 1,
  //       name: place.name,
  //       category: place.category,
  //       distance: place.distance,
  //     }));
  //     setEditItinerary(itinerary);
  //   } catch (err) {
  //     console.error("Edit Foursquare error:", err);
  //     setEditNearbyPlaces([]);
  //     setEditItinerary([]);
  //   }
  // };

  // 🔹 Distance helper
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // 🔹 Outfit recommendation
  const outfitRecommendation = () => {
    if (!weather) return "";
    const temp = weather.main.temp;
    if (temp >= 30) return "Wear light clothes, sunscreen, and a hat 🌞";
    if (temp >= 20) return "Comfortable clothes, maybe a light jacket 🌤";
    if (temp < 20) return "Wear warm clothes and carry an umbrella ☔️";
  };

  // 🔹 Delete trip
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await API.delete(`/trips/${id}`);
      toast.success("Trip deleted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete trip.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not set";
    const d = new Date(date);
    return isNaN(d) ? "Not set" : d.toLocaleDateString();
  };

  // 🔹 Countdown
  useEffect(() => {
    if (!trip?.startDate) return;
    const interval = setInterval(() => {
      const diffMs = new Date(trip.startDate) - new Date();
      if (diffMs <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      setTimeLeft({ days, hours, minutes });
    }, 1000);
    return () => clearInterval(interval);
  }, [trip]);

  // 🔹 Update trip
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      setSaving(true);
      await API.put(`/trips/${id}`, {
        title: formData.title.trim(),
        destination: formData.destination,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        activities: formData.activities
          ? formData.activities.split(",").map((a) => a.trim())
          : [],
      });
      setIsEditOpen(false);
      toast.success("Trip updated successfully!");
      fetchTrip();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update trip.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActivity = (index) => {
    const newChecked = [...checkedActivities];
    newChecked[index] = !newChecked[index];
    setCheckedActivities(newChecked);
  };

  const isToday = () => {
    if (!trip?.startDate) return false;
    const today = new Date();
    const start = new Date(trip.startDate);
    return today.toDateString() === start.toDateString();
  };

  if (loading) return <p style={{ padding: "24px" }}>Loading...</p>;
  if (error) return <p style={{ padding: "24px", color: "red" }}>{error}</p>;

  
      {/* Navbar & Trip Card will go here */}
      {/* For brevity, you can copy the same JSX from previous component */}
      {/* Nearby places markers and suggested itinerary now use Foursquare data */}
  


  return (
    <div className="bg">
      <Navbar />
      <div className="trip-details-page">
        <div className="trip-card">
          <h1>{trip.title}</h1>
          <div><strong>Destination:</strong> {trip.destination || "-"}</div>
          <p>
            <strong>Dates:</strong>{" "}
            {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "-"} -{" "}
            {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : "-"}
          </p>
          <p className="countdown">
            {isToday()
              ? "🎉 Trip is today!"
              : `Starts in ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}
          </p>

          {weather && (
            <>
              <p className="weather">
                🌤 {weather.weather[0].description}, {weather.main.temp}°C
              </p>
              <p className="recommendation">{outfitRecommendation()}</p>
            </>
          )}

          {coords && (
            <div className="trip-map">
              <MapContainer center={coords} zoom={10} style={{ height: "250px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={coords}>
                  <Popup>{trip.destination}</Popup>
                </Marker>
                {nearbyPlaces.map((place, idx) => (
                  <Marker key={idx} position={[place.lat, place.lon]}>
                    <Popup>{place.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}

          <h2>Suggested Itinerary</h2>
          {suggestedItinerary.length > 0 ? (
            <ul className="activities-list">
              {suggestedItinerary.map((item, idx) => (
                <li key={idx}>
                  <strong>Day {item.day}:</strong> {item.name}
                  <span style={{ color: "#6b7280", marginLeft: "6px" }}>
                    ({item.category}, {(item.distance / 1000).toFixed(1)} km)
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#9ca3af", fontStyle: "italic" }}>
              Nearby places are loading or not available for this location.
            </p>
          )}

          {/* Activities */}
          <h2>Activities:</h2>
          {trip.activities && trip.activities.length > 0 ? (
            <ul className="activities-list">
              {trip.activities.map((activity, index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    checked={checkedActivities[index]}
                    onChange={() => toggleActivity(index)}
                  />{" "}
                  {activity}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#9ca3af", fontStyle: "italic" }}>No activities added yet.</p>
          )}

          {/* Nearby Places */}
          <h2>Nearby Places</h2>
<div className="places-grid">
  {nearbyPlaces.length > 0 ? (
    nearbyPlaces.map((place, idx) => (
      <div key={idx} className="place-card">
        <h3>{place.name}</h3>
        <p className="place-category">{place.category}</p>
      </div>
    ))
  ) : (
    <p style={{ color: "#9ca3af" }}>No nearby places found</p>
  )}
</div>

          {/* Activities & Costs */}
          <h2>Activities & Estimated Cost</h2>
          {activityCosts.length > 0 ? (
            <ul className="activities-list">
              {activityCosts.map((a, idx) => (
                <li key={idx}>
                  {a.activity}
                  <input
                    type="number"
                    value={a.cost}
                    min="0"
                    className="cost-input"
                    onChange={(e) => {
                      const updated = [...activityCosts];
                      updated[idx].cost = Number(e.target.value);
                      setActivityCosts(updated);
                    }}
                  />
                  <span>₹</span>
                </li>
              ))}
              <li>
                <strong>Total Estimated Cost</strong>
                <strong>₹{totalCost}</strong>
              </li>
            </ul>
          ) : (
            <p className="muted">No activities added yet.</p>
          )}

          <div className="button-group">
            <button onClick={() => setIsEditOpen(true)} className="button-edit">
              Edit Trip
            </button>
            <button onClick={handleDelete} className="button-delete">
              Delete Trip
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Edit Trip</h2>
            <form onSubmit={handleUpdate}>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Title"
                required
              />
              <input
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="Destination"
                required
              />
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
              <textarea
                value={formData.activities}
                onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                placeholder="Activities (comma separated)"
              />

              {/* LIVE MAP & ITINERARY PREVIEW */}
              {/* <h3>Preview Map & Nearby Places</h3>
              {editCoords ? (
                <MapContainer center={editCoords} zoom={12} style={{ height: "200px", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={editCoords}>
                    <Popup>{formData.destination}</Popup>
                  </Marker>
                  {editNearbyPlaces.map((place, idx) => (
                    <Marker key={idx} position={[place.lat, place.lon]}>
                      <Popup>{place.name}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              ) : (
                <p style={{ color: "#9ca3af" }}>Enter a destination to preview map and nearby places</p>
              )} */}

              <h3>Suggested Itinerary (Live)</h3>
              {editItinerary.length > 0 ? (
                <ul>
                  {editItinerary.map((item, idx) => (
                    <li key={idx}>
                      <strong>Day {item.day}:</strong> {item.name}{" "}
                      <span style={{ color: "#6b7280" }}>
                        ({item.category}, {(item.distance / 1000).toFixed(1)} km)
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#9ca3af" }}>No suggestions yet</p>
              )}

              <div className="modal-actions">
                <button type="submit" className="button-edit" disabled={saving || !formData.title.trim()}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button type="button" className="button-delete" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
            <Footer/>
      
    </div>
  );
}
