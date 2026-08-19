import "./Hero.css";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="hero" id="hero">

      <div className="hero-left">

        <span className="hero-badge">
          🚀 AI Powered Interview Platform
        </span>

        <h1>
          Ace Your Next <span>Technical Interview</span> with AI
        </h1>

        <p>
          Prepare smarter with AI-generated interview questions,
          instant feedback, and detailed performance analytics.
        </p>

        <div className="hero-buttons">

          <Link to="/register" className="primary-btn">
            Get Started
            <ArrowRight size={18} />
          </Link>

          <button className="secondary-btn">
            <PlayCircle size={20} />
            Watch Demo
          </button>

        </div>

      </div>

      <div className="hero-right">

        <div className="hero-card">

          <h3>Today's Progress</h3>

          <div className="progress-item">
            <span>Interviews</span>
            <strong>12</strong>
          </div>

          <div className="progress-item">
            <span>Average Score</span>
            <strong>88%</strong>
          </div>

          <div className="progress-item">
            <span>Confidence</span>
            <strong>High</strong>
          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;