import { useState, useEffect } from "react";
import API from "../services/Api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import logo from "../logo.png";

const backgrounds = [
  "/assets/t1.jpg",
  "/assets/t2.jpg",
  "/assets/t3.jpg",
  "/assets/t4.jpg",
  "/assets/t5.jpg",
  "/assets/t6.jpg"
];

const quotes = [
  "Travel is the only thing you buy that makes you richer.",
  "Adventure awaits those who seek it.",
  "Collect moments, not things.",
  "Life is short and the world is wide.",
  "Explore. Dream. Discover.",
  "Wander often, wonder always."
];

export default function Login() {
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Rotate background & quote every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-wrapper">
      {/* LEFT SIDE: Rotating photo + quote */}
      <div
        className="login-left"
        style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
      >
        <div className="quote">
          <p>{quotes[bgIndex]}</p>
        </div>
      </div>

      {/* RIGHT SIDE: Login card */}
      <div className="login-right">
        <div className="login-card">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          <p>
            Don’t have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}
