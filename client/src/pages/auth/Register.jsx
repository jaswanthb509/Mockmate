import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  return (
    <div className="register-page">

      <div className="register-card">

        <div className="register-header">

          <h1>
            Mock<span>Mate</span>
          </h1>

          <h2>Create Account 🚀</h2>

          <p>
            Start your AI interview journey today.
          </p>

        </div>

        <form className="register-form">

          <div className="input-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
            />
          </div>

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

          <div className="input-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm password"
            />
          </div>

          <button
            className="register-btn"
            type="submit"
          >
            Create Account
          </button>

        </form>

        <div className="login-link">

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Register;