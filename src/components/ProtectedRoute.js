import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // If not logged in, redirect to login
    return <Navigate to="/" replace />;
  }

  // If logged in, show the requested page
  return children;
}
