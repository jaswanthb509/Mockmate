import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Send,
} from "lucide-react";

import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setMessage(
      "Password reset functionality will be available soon. For now, please contact support or create a new account."
    );
  };

  return (
    <main className="forgot-password-page">
      <section className="forgot-password-card">
        <Link
          to="/login"
          className="forgot-back-button"
        >
          <ArrowLeft size={17} />
          Back to Login
        </Link>

        <div className="forgot-password-icon">
          <Mail size={28} />
        </div>

        <p className="forgot-password-label">
          PASSWORD RECOVERY
        </p>

        <h1>Forgot your password?</h1>

        <p className="forgot-password-description">
          Enter your email address and we'll help you
          recover access to your MockMate account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="forgot-password-form"
        >
          <div className="forgot-password-field">
            <label htmlFor="email">
              Email address
            </label>

            <div className="forgot-password-input-wrapper">
              <Mail size={18} />

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>
          </div>

          {error && (
            <p className="forgot-password-error">
              {error}
            </p>
          )}

          {message && (
            <p className="forgot-password-success">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="forgot-password-submit"
          >
            <Send size={17} />
            Send Recovery Instructions
          </button>
        </form>

        <p className="forgot-password-footer">
          Remember your password?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;