import "./QuickActions.css";
import { Link } from "react-router-dom";
import {
  PlayCircle,
  History,
  FileText,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

const actions = [
  {
    title: "New Interview",
    description: "Start practicing now",
    icon: <PlayCircle size={24} />,
    link: "/setup",
  },
  {
    title: "Interview History",
    description: "Review past sessions",
    icon: <History size={24} />,
    link: "/history",
  },
  {
    title: "Resume Analyzer",
    description: "Get AI-powered insights",
    icon: <FileText size={24} />,
    link: "/resume",
  },
  {
    title: "Analytics",
    description: "Track your improvement",
    icon: <BarChart3 size={24} />,
    link: "/analytics",
  },
];

const QuickActions = () => {
  return (
    <section className="quick-actions">
      <div className="quick-actions-header">
        <div>
          <span className="quick-actions-eyebrow">WORKSPACE</span>
          <h2>Quick Actions</h2>
        </div>
      </div>

      <div className="action-grid">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.link}
            className="action-card"
          >
            <div className="action-card-top">
              <div className="action-icon">
                {action.icon}
              </div>

              <ArrowUpRight
                size={17}
                className="action-arrow"
              />
            </div>

            <div className="action-card-content">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;