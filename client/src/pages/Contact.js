import { useState } from "react";
import "../styles/contact.css";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Inquiry received. A Nyora specialist will reach out shortly.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg">
      <Navbar />
      
      <div className="contact-page">
        <h1>Connect with Nyora</h1>
        <p className="contact-subtitle">
          Whether you have a specific inquiry or just want to share your latest 
          travel story, we’re here to listen.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <textarea
            placeholder="How can we assist your next journey?"
            rows="5"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />

          <button type="submit">Submit Inquiry</button>
        </form>
      </div>

      <Footer />
    </div>
  );
}