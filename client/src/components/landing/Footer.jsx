import "./Footer.css";
import { ArrowUpRight, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-brand-top">
              <span>AI-POWERED INTERVIEW PRACTICE</span>
            </div>

            <h2>
              Mock<span>Mate</span>
            </h2>

            <p>
              Practice smarter with AI-powered mock interviews, personalized
              feedback, and performance insights designed to help you prepare
              with confidence.
            </p>

            <a href="/register" className="footer-cta">
              Start Your Journey
              <ArrowUpRight size={17} />
            </a>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3>Platform</h3>
              <a href="#hero">Home</a>
              <a href="#features">Features</a>
              <a href="/login">Login</a>
              <a href="/register">Get Started</a>
            </div>

            <div className="footer-column">
              <h3>Features</h3>
              <a href="#features">AI Questions</a>
              <a href="#features">AI Feedback</a>
              <a href="#features">Company Practice</a>
              <a href="#features">Performance Reports</a>
            </div>

            <div className="footer-column">
              <h3>Support</h3>
              <a href="/login">My Account</a>
              <a href="/register">Create Account</a>
              <a href="#features">How It Works</a>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>
            © 2026 <span>MockMate</span>. All rights reserved - Made by Jaswanth.
          </p>

          <div className="footer-tagline">
            <span>Prepare</span>
            <i></i>
            <span>Practice</span>
            <i></i>
            <span>Perform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;