import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlayCircle,
  History,
  BarChart3,
  User,
  Settings,
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
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <LayoutDashboard size={19} />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <History size={19} />
            <span>Interview History</span>
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <BarChart3 size={19} />
            <span>Analytics</span>
          </NavLink>

          <p className="nav-section-title sidebar-second-section">
            ACCOUNT
          </p>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <User size={19} />
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <Settings size={19} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-upgrade">
          <div className="upgrade-icon">
            <Sparkles size={16} />
          </div>

          <div className="upgrade-content">
            <strong>Unlock more with Pro</strong>
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