import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Mock<span>Mate.</span>
      </Link>

      <ul className="nav-links">
        <li>
          <a href="#hero">Home</a>
        </li>

        <li>
          <a href="#features">Features</a>
        </li>
      </ul>

      <div className="nav-buttons">
        <Link to="/login" className="login-btn">
          Login
        </Link>

        <Link to="/register" className="register-btn">
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;