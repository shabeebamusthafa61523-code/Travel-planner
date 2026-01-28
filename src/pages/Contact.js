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
    toast.success("Message sent successfully! 🚀");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg">
    <Navbar/>
    <div className="contact-page">
      <h1>Contact Us 📩</h1>
      <p className="contact-subtitle">
        Have questions or suggestions? We’d love to hear from you.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <textarea
          placeholder="Your Message"
          rows="5"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />

        <button type="submit">Send Message</button>
      </form>
    </div>
    <Footer/>
    </div>
  );
}
