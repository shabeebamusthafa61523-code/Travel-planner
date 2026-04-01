import axios from "axios";

const API = axios.create({
  // Use VITE_ prefix for Vite environment variables
baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;