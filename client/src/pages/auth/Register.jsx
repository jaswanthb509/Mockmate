import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Register.css";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await register(
        trimmedName,
        trimmedEmail,
        password
      );

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Registration failed:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <section className="register-showcase">
        <div className="register-showcase-content">
          <Link to="/" className="register-back-home">
            ← Back to home
          </Link>

          <div className="register-showcase-brand">
            Mock<span>Mate.</span>
          </div>

          <div className="register-showcase-text">
            <span className="register-showcase-label">
              START YOUR JOURNEY
            </span>

            <h1>
              Your next interview
              <br />
              starts with practice.
            </h1>

            <p>
              Create your MockMate account and practice personalized
              interviews designed to help you become more confident
              and prepared.
            </p>
          </div>

          <div className="register-benefits">
            <div className="register-benefit">
              <span>01</span>
              <div>
                <h3>Choose your interview</h3>
                <p>Role, difficulty, experience, and technology stack.</p>
              </div>
            </div>

            <div className="register-benefit">
              <span>02</span>
              <div>
                <h3>Practice with AI</h3>
                <p>Answer personalized interview questions.</p>
              </div>
            </div>

            <div className="register-benefit">
              <span>03</span>
              <div>
                <h3>Improve with feedback</h3>
                <p>Get detailed insights and track your progress.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="register-glow register-glow-one"></div>
        <div className="register-glow register-glow-two"></div>
      </section>

      <section className="register-panel">
        <div className="register-card">
          <div className="register-header">
            <span className="register-tag">
              CREATE ACCOUNT
            </span>

            <h2>Start practicing today</h2>

            <p>
              Create your free account and begin your AI interview journey.
            </p>
          </div>

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            <div className="register-input-group">
              <label htmlFor="name">
                Full name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                disabled={loading}
              />
            </div>

            <div className="register-input-group">
              <label htmlFor="email">
                Email address
              </label>

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

            <div className="register-input-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div className="register-input-group">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <button
              className="register-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create your MockMate account
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="register-divider">
            <span></span>
            <p>ALREADY HAVE AN ACCOUNT?</p>
            <span></span>
          </div>

          <Link
            to="/login"
            className="register-login-btn"
          >
            Log in instead
          </Link>

          <p className="register-footer">
            Practice. Get feedback. Improve with every interview.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Register;