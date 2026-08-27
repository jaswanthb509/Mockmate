import "./Hero.css";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Clock3,
  Mic,
  Sparkles,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero-left">
        <span className="hero-badge">
          <Sparkles size={16} />
          An AI-Powered Interview Platform
        </span>

        <h1>
          Practice Smarter.
          <br />
          <span>Improve your skills.</span>
        </h1>

        <p>
          Prepare for your next opportunity with AI-generated, company-specific
          interview questions, intelligent feedback, voice-based practice, and
          personalized performance insights.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="primary-btn">
            Start Practicing
            <ArrowRight size={20} />
          </Link>

          <a href="#features" className="secondary-btn">
            <PlayCircle size={20} />
            Explore Features
          </a>
        </div>

        <div className="hero-points">
          <span>
            <CheckCircle2 size={18} />
            Company-specific preparation
          </span>

          <span>
            <CheckCircle2 size={18} />
            AI-powered feedback
          </span>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-glow"></div>

        <div className="hero-card-wrapper">
          <div className="hero-card">
            <div className="interview-card-header">
              <div>
                <p className="mock-label">MOCK INTERVIEW</p>
                <h3>Frontend Developer</h3>
              </div>

              <span className="live-badge">
                <span className="live-dot"></span>
                Live Practice
              </span>
            </div>

            <div className="interview-tags">
              <span>⌘ React</span>
              <span>Intermediate</span>
            </div>

            <div className="progress-section">
              <div className="progress-info">
                <span>Question 3 of 8</span>
                <strong>38%</strong>
              </div>

              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>

            <div className="question-box">
              <p className="question-label">AI-GENERATED QUESTION</p>

              <h4>
                Explain the difference between <span>useEffect</span> and{" "}
                <span>useLayoutEffect</span> in React.
              </h4>
            </div>

            <div className="card-action-row">
              <div className="time-remaining">
                <Clock3 size={18} />
                <span>04:32 remaining</span>
              </div>

              <button className="voice-answer-btn">
                <Mic size={18} />
                Answer by Voice
              </button>
            </div>

            <div className="card-bottom">
              <Sparkles size={18} />
              <span>AI evaluation ready after your response</span>
            </div>
          </div>
        </div>

        <div className="feedback-card">
          <p>AI Feedback</p>
          <strong>Ready</strong>

          <div className="feedback-lines">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;