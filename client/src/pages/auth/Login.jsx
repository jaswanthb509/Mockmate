import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(trimmedEmail, password);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-showcase">
        <div className="showcase-content">
          <Link to="/" className="back-home">
            ← Back to home
          </Link>

          <div className="showcase-brand">
            Mock<span>Mate.</span>
          </div>

          <div className="showcase-text">
            <span className="showcase-label">
              AN AI-POWERED INTERVIEW PRACTICE PLATFORM
            </span>

            <h1>
              Practice smarter.
              <br />
              Interview with confidence.
            </h1>

            <p>
              Prepare for your dream job with personalized AI interviews,
              instant feedback, and detailed performance insights.
            </p>
          </div>

          <div className="showcase-features">
            <div>
              <span>✦</span>
              Personalized interview questions
            </div>

            <div>
              <span>✦</span>
              Instant AI-powered feedback
            </div>

            <div>
              <span>✦</span>
              Track your interview progress
            </div>
          </div>
        </div>

        <div className="showcase-glow glow-one"></div>
        <div className="showcase-glow glow-two"></div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="login-header">
            <span className="login-tag">WELCOME BACK</span>

            <h2>Continue your journey</h2>

            <p>
              Log in to practice, improve, and track your interview progress.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">Email address:</label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <div className="password-label-row">
                <label htmlFor="password">Password:</label>

                <Link to="#" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            <button
              className="login-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Continue to MockMate
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span></span>
            <p>NEW TO MOCKMATE?</p>
            <span></span>
          </div>

          <Link to="/register" className="create-account-btn">
            Create your account
          </Link>

          <p className="login-footer">
            Practice interviews. Learn from feedback. Get better every day.
          </p>
          <p className="login-footer">-By Jaswanth</p>
        </div>
      </section>
    </div>
  );
};

export default Login;