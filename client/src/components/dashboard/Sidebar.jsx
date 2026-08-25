import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlayCircle,
  History,
  BarChart3,
  UserRound,
  FileText,
  LogOut,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const getNavLinkClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <aside className="mockmate-sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Sparkles size={19} />
          </div>

          <div className="brand-name">
            <span>Mock</span>
            <strong>Mate.</strong>
          </div>
        </div>

        <button
          className="new-interview-btn"
          onClick={() => navigate("/setup")}
        >
          <PlayCircle size={18} />
          <span>New Interview</span>
          <ChevronRight size={16} />
        </button>

        <nav className="sidebar-nav">
          <p className="nav-section-title">WORKSPACE</p>

          <NavLink
            to="/dashboard"
            className={getNavLinkClass}
          >
            <LayoutDashboard size={19} />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/history"
            className={getNavLinkClass}
          >
            <History size={19} />
            <span>Interview History</span>
          </NavLink>

          <NavLink
            to="/analytics"
            className={getNavLinkClass}
          >
            <BarChart3 size={19} />
            <span>Analytics</span>
          </NavLink>

          <NavLink
            to="/resume"
            className={getNavLinkClass}
          >
            <FileText size={19} />
            <span>Resume Analyzer</span>
          </NavLink>

          <p className="nav-section-title sidebar-second-section">
            CAREER
          </p>

          <NavLink
            to="/career-profile"
            className={getNavLinkClass}
          >
            <UserRound size={19} />
            <span>Career Profile</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-upgrade">
          <div className="upgrade-icon">
            <Sparkles size={16} />
          </div>

          <div className="upgrade-content">
            <strong>Practice Today with</strong>
            <span>Advanced AI insights</span>
          </div>
        </div>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;