import "./Dashnav.css";
import { Link } from "react-router-dom";

const Dashnav = () => {
  return (
    <nav className="dashboard-navbar">

      <div className="dashboard-logo">
        Mock<span>Mate</span>
      </div>

      <ul className="dashboard-links">

        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/history">History</Link>
        </li>

      </ul>

      <button className="logout-btn">
        Logout
      </button>

    </nav>
  );
};

export default Dashnav;