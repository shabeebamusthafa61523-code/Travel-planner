import { useState } from "react";
import API from "../services/Api";
import { useNavigate } from "react-router-dom";
import '../styles/register.css'
import { toast } from "react-toastify";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await API.post("api/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Registration successful! Please login.");
      navigate("/"); // Redirect to login
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Try again.");
      }
    }
  };

  return (
  // Inside your Register return statement
<div className="register-wrapper">
  <div className="register-card">
    <h2>Join Nyora</h2> {/* Changed title for a more premium feel */}

    {error && <div className="error-text">{error}</div>}

    <div className="form-group">
      <input
        placeholder="Full Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        placeholder="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
    </div>

    <button onClick={handleRegister}>Create Account</button>

    <p className="switch-text">
      Already a member?
      <span onClick={() => navigate("/")}> Login</span>
    </p>
  </div>
</div>
);
}