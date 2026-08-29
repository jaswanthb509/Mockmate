import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Send,
  CheckCircle2,
} from "lucide-react";

import API from "../../services/api";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/forgot-password",
        {
          email: trimmedEmail,
        }
      );

      const data = response.data;

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Unable to process your request."
        );
      }

      setMessage(
        data.message ||
          "If an account exists with this email, password reset instructions have been sent."
      );

      setEmail("");
    } catch (error) {
      console.error(
        "Forgot Password Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          {error && (
            <p className="forgot-password-error">
              {error}
            </p>
          )}

          {message && (
            <div className="forgot-password-success">
              <CheckCircle2 size={18} />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            className="forgot-password-submit"
            disabled={loading}
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                <Send size={17} />
                Send Recovery Instructions
              </>
            )}
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