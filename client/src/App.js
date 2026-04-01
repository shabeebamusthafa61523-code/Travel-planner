import logo from './logo.svg';
import './App.css';

    import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import TripDetails from "./pages/TripDetails";
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from "react-toastify";
import Navbar from './components/Navbar';
import Test from './components/Test';
import CommonChat from './pages/CommonChat';
import About from './pages/About';
import Contact from './pages/Contact';


function App() {
  console.log("TEST →", process.env.REACT_APP_TEST);

  return (
    <>
     <ToastContainer position="top-right" autoClose={3000} />
      <Routes>

        {/* <Route path="/" element={<Test />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-trip"
          element={
            <ProtectedRoute>
              <CreateTrip />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip/:id"
          element={
            <ProtectedRoute>
              <TripDetails />
            </ProtectedRoute>
          }
          />
          <Route
  path="/chat"
  element={
    <ProtectedRoute>
      <CommonChat />
    </ProtectedRoute>
  }
/>
          <Route
  path="/about"
  element={
    <ProtectedRoute>
      <About />
    </ProtectedRoute>
  }
/>
          <Route
  path="/contact"
  element={
    <ProtectedRoute>
      <Contact />
    </ProtectedRoute>
  }
/>
      </Routes>
      </>
  );
}


export default App;
