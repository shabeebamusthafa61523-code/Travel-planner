import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>NYORA🌍 Travel Planner</h3>
        <p>Plan smarter. Travel better.</p>

        <div className="footer-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/create-trip">Create Trip</a>
          <a href="/about">About</a>
        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} Travel Planner. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
