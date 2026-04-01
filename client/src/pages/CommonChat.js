import { useEffect, useState, useRef } from "react";
import API from "../services/Api";
import "../styles/CommonChat.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function CommonChat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const chatRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await API.get("/chat/global");
      setMessages(res.data);
    } catch (err) {
      console.error("Chat load error", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await API.post("/chat/global", { message: text });
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  // Improved auto-scroll logic
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    fetchMessages();
    // Optional: Set up polling every 5 seconds for "real-time" feel without WebSockets
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg">
      <Navbar />
      <div className="chat-container">
        <h2>Global Explorers Chat</h2>
        <div className="chat-box">
          <div className="chat-messages" ref={chatRef}>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat-message ${
                  msg.sender?._id === currentUser?._id ? "user" : "bot"
                }`}
              >
                <span className="sender">{msg.sender?.name || "Explorer"}</span>
                <p>{msg.message}</p>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="chat-input">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share a travel tip..."
            />
            <button type="submit" disabled={!text.trim()}>
              <span style={{ fontSize: '1.2rem' }}>➤</span>
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}