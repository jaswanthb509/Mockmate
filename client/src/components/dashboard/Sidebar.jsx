import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlayCircle,
  History,
  BarChart3,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="mockmate-sidebar">

      <div className="sidebar-brand">
        <span>Mock</span>
        <strong>Mate</strong>
      </div>

      <nav className="sidebar-nav">

        <NavLink to="/dashboard">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/setup">
          <PlayCircle size={20} />
          <span>New Interview</span>
        </NavLink>

        <NavLink to="/history">
          <History size={20} />
          <span>Interview History</span>
        </NavLink>

        <NavLink to="/analytics">
          <BarChart3 size={20} />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/profile">
          <User size={20} />
          <span>Profile</span>
        </NavLink>

        <NavLink to="/settings">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

      </nav>

      <div className="sidebar-bottom">

        <button
          className="sidebar-logout"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;