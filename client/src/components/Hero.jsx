import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">

      <div className="hero-left">

        <span className="hero-badge">
          🚀 AI Powered Interview Platform
        </span>

        <h1>
          Ace Your Next
          <br />
          <span>Interview</span> With AI
        </h1>

        <p>
          Practice realistic mock interviews, receive instant AI-powered
          feedback, improve your communication skills, and boost your confidence
          before your dream job interview.
        </p>

        <div className="hero-buttons">

          <button className="primary-btn">
            Start Free
          </button>

          <button className="secondary-btn">
            Watch Demo
          </button>

        </div>

      </div>

      <div className="hero-right">

        <div className="interview-card">

          <h2>🤖 AI Interview</h2>

          <p>Frontend Developer</p>

          <div className="progress">
            Question 1 / 10
          </div>

          <button>
            Start Interview
          </button>

        </div>

      </div>

    </section>
  );
};

export default Hero;