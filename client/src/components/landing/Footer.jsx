import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>
            Mock<span>Mate</span>
          </h2>

          <p>
            Your AI-powered platform for smarter interview preparation,
            personalized practice, and better performance.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h3>Platform:</h3>

            <a href="#hero">Home</a>
            <a href="#features">Features</a>
            <a href="/login">Login</a>
            <a href="/register">Get Started</a>
          </div>

          <div className="footer-column">
            <h3>Features:</h3>

            <a href="#features">AI Questions</a>
            <a href="#features">AI Feedback</a>
            <a href="#features">Company Practice</a>
            <a href="#features">Performance Reports</a>
          </div>

          <div className="footer-column">
            <h3>Support:</h3>

            <a href="/login">My Account</a>
            <a href="/register">Create Account</a>
            <a href="#features">How It Works</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 MockMate. All rights reserved. -By Jaswanth</p>

        <div>
          <span>Prepare.</span>
          <span>Practice.</span>
          <span>Perform.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;