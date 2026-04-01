import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/about.css";

export default function About() {
  return (
    <div className="bg">
      <Navbar />
      
      <div className="about-page">
        <h1>THE NYORA VISION</h1>

        <p className="about-intro">
          We believe travel should be about the experience, not the logistics. 
          Nyora is designed to be your digital concierge, bridging the gap between 
          planning and adventure.
        </p>

        <div className="about-sections">
          <div className="about-card">
            <h3>Our Mission</h3>
            <p>
              We empower global explorers to organize seamless journeys by 
              integrating real-time data, intuitive maps, and localized 
              insights into a single, premium interface.
            </p>
          </div>

          <div className="about-card">
            <h3>Core Intelligence</h3>
            <ul>
              <li>Advanced Journey Analytics</li>
              <li>Localized Attraction Discovery</li>
              <li>Contextual Weather Intelligence</li>
              <li>Precision Itinerary Drafting</li>
            </ul>
          </div>

          <div className="about-card">
            <h3>Premium Design</h3>
            <p>
              Every pixel of Nyora is crafted for clarity. Whether you are 
              planning a weekend escape or a cross-continental expedition, 
              we provide the tools to travel with confidence.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}