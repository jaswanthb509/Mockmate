import { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError(
        "Please enter both email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to log in."
        );
      }

      if (!data.token) {
        throw new Error(
          "Login succeeded but no authentication token was received."
        );
      }

      localStorage.setItem(
        "token",
        data.token
      );

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      const redirectPath =
        location.state?.from || "/dashboard";

      navigate(redirectPath, {
        replace: true,
      });
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-left-panel">
        <div className="login-brand">
          <span>Mock</span>
          <strong>Mate.</strong>
        </div>

        <div className="login-hero-content">
          <p className="login-platform-label">
            AN AI-POWERED INTERVIEW PRACTICE PLATFORM
          </p>

          <h1>
            Practice smarter.
            <br />
            Interview with
            <br />
            confidence.
          </h1>

          <p className="login-description">
            Prepare for your dream job with
            personalized AI interviews, instant
            feedback, and detailed performance
            insights.
          </p>

          <div className="login-features">
            <div>
              <Sparkles size={15} />
              <span>
                Personalized interview questions
              </span>
            </div>

            <div>
              <Sparkles size={15} />
              <span>
                Instant AI-powered feedback
              </span>
            </div>

            <div>
              <Sparkles size={15} />
              <span>
                Track your interview progress
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="login-right-panel">
        <div className="login-form-container">
          <p className="login-welcome-label">
            WELCOME BACK
          </p>

          <h2>Continue your journey</h2>

          <p className="login-subtitle">
            Log in to practice, improve, and track
            your interview progress.
          </p>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="login-field">
              <label htmlFor="email">
                Email address
              </label>

              <div className="login-input-wrapper">
                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <div className="login-password-label">
                <label htmlFor="password">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="forgot-password-link"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="login-input-wrapper">
                <Lock size={18} />

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="login-error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Continue to MockMate
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>NEW TO MOCKMATE?</span>
          </div>

          <Link
            to="/register"
            className="create-account-button"
          >
            Create your account
          </Link>

          <p className="login-footer-text">
            Practice interviews. Learn from feedback.
            Get better every day.
          </p>

          <p className="login-author">
            -By Jaswanth
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;