import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import API from "../../services/api";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError(
        "This password reset link is invalid."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        `/auth/reset-password/${token}`,
        {
          password,
        }
      );

      const data = response.data;

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Unable to reset your password."
        );
      }

      setSuccess(
        data.message ||
          "Password reset successfully."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 2000);
    } catch (error) {
      console.error(
        "Reset Password Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to reset your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="reset-password-page">
      <section className="reset-password-card">
        <Link
          to="/login"
          className="reset-back-button"
        >
          <ArrowLeft size={17} />
          Back to Login
        </Link>

        <div className="reset-password-icon">
          <Lock size={28} />
        </div>

        <p className="reset-password-label">
          PASSWORD RECOVERY
        </p>

        <h1>Create a new password</h1>

        <p className="reset-password-description">
          Choose a new password for your MockMate
          account. Make sure it is at least 6
          characters long.
        </p>

        <form
          className="reset-password-form"
          onSubmit={handleSubmit}
        >
          <div className="reset-password-field">
            <label htmlFor="password">
              New password
            </label>

            <div className="reset-password-input-wrapper">
              <Lock size={18} />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your new password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                disabled={loading}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-visibility-button"
                onClick={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="reset-password-field">
            <label htmlFor="confirmPassword">
              Confirm new password
            </label>

            <div className="reset-password-input-wrapper">
              <Lock size={18} />

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                disabled={loading}
                autoComplete="new-password"
              />

              <button
                type="button"
                className="password-visibility-button"
                onClick={() =>
                  setShowConfirmPassword(
                    (previous) => !previous
                  )
                }
                disabled={loading}
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="reset-password-error">
              {error}
            </div>
          )}

          {success && (
            <div className="reset-password-success">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            className="reset-password-submit"
            disabled={loading || Boolean(success)}
          >
            {loading ? (
              "Resetting password..."
            ) : (
              <>
                Reset Password
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="reset-password-footer">
          Remember your password?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
};

export default ResetPassword;