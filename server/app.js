// app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// --- Middleware ---

// Configure CORS for security
const allowedOrigins = [
  process.env.FRONTEND_URL, // Your Vercel URL (add to .env later)
  "http://localhost:5173",  // Vite default
  "http://localhost:3000"   // React default
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/chat", chatRoutes);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "success", 
    message: "Nyora Travel API is live!" 
  });
});

// --- Global Error Handler ---
// This prevents the server from crashing and sends clean errors to the frontend
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    // Only show stack trace in development mode
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
});

module.exports = app;