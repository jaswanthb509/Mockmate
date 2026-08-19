import "./QuickActions.css";
import { Link } from "react-router-dom";
import {
  PlayCircle,
  History,
  FileText,
  BarChart3,
} from "lucide-react";

const actions = [
  {
    title: "Start New Interview",
    icon: <PlayCircle size={30} />,
    link: "/setup",
  },
  {
    title: "Interview History",
    icon: <History size={30} />,
    link: "/history",
  },
  {
    title: "Resume Analyzer",
    icon: <FileText size={30} />,
    link: "/resume",
  },
  {
    title: "Analytics",
    icon: <BarChart3 size={30} />,
    link: "/analytics",
  },
];

const QuickActions = () => {
  return (
    <section className="quick-actions">
      <h2>Quick Actions</h2>

      <div className="action-grid">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="action-card"
          >
            <div className="action-icon">
              {action.icon}
            </div>

            <h3>{action.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;