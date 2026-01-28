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
  const isFirstLoad = useRef(true);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await API.get("/chat/global");
      setMessages(res.data);
    } catch (err) {
      console.error("Chat load error", err);
    }
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await API.post("/chat/global", {
        message: text,
      });

      setMessages((prev) => [...prev, res.data]);
      setText("");

      // scroll ONLY when sending
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 50);
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  // Auto-scroll only after first load
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="bg">
      <Navbar />

      <div className="chat-container">
        <h2>🌍 Common Travel Chat</h2>

        <div className="chat-box">
          <div className="chat-messages" ref={chatRef}>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat-message ${
                  msg.sender?._id === currentUser?._id ? "user" : "bot"
                }`}
              >
                <span className="sender">{msg.sender?.name}</span>
                <p>{msg.message}</p>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="chat-input">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit" disabled={!text.trim()}>
              ➤
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
