import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Removed emoji for a cleaner, high-end professional look */}
        <h3>NYORA</h3>
        <p>Plan smarter. Travel better.</p>

        <div className="footer-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/create-trip">Create Trip</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>

        <div className="footer-copy">
          <p>© {new Date().getFullYear()} NYORA Travel. Crafted for global explorers.</p>
        </div>
      </div>
    </footer>
  );
}