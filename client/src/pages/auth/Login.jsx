import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <h1>
            Mock<span>Mate</span>
          </h1>

          <h2>Welcome Back 👋</h2>

          <p>
            Continue your AI interview journey.
          </p>

        </div>

        <form className="login-form">

          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
            />

          </div>

          <div className="input-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
            />

          </div>

          <div className="forgot-password">

            <Link to="#">
              Forgot Password?
            </Link>

          </div>

          <button
            className="login-btn"
            type="submit"
          >
            Login
          </button>

        </form>

        <div className="register-link">

          Don't have an account?

          <Link to="/register">
            Register
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Login;