import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <header className="header">

      <nav className="navbar">

        <div className="logo">
          Mock<span>Mate</span>
        </div>

        <ul className="nav-menu">

          <li>
            <a href="#home">Home</a>
          </li>

          <li>
            <a href="#features">Features</a>
          </li>

          <li>
            <a href="#about">About</a>
          </li>

          <li>
            <a href="#contact">Contact</a>
          </li>

        </ul>

        <div className="nav-btn">

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="signup-btn">
            Get Started
          </Link>

        </div>

      </nav>

    </header>
  );
};

export default Navbar;