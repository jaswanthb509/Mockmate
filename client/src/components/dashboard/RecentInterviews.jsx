import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";

import "./RecentInterviews.css";

const interviews = [
  {
    company: "Amazon",
    role: "Software Engineer",
    type: "Technical",
    score: 92,
    date: "2 days ago",
  },
  {
    company: "Microsoft",
    role: "Frontend Developer",
    type: "Technical",
    score: 87,
    date: "4 days ago",
  },
  {
    company: "Google",
    role: "Software Engineer",
    type: "Behavioral",
    score: 90,
    date: "1 week ago",
  },
];

const RecentInterviews = () => {
  return (
    <section className="recent-interviews">
      <div className="recent-interviews-header">
        <div>
          <p className="section-label">History</p>
          <h2>Recent Interviews</h2>
        </div>

        <Link to="/history">
          View all
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="interview-list">
        {interviews.map((interview, index) => (
          <div className="interview-row" key={index}>
            <div className="interview-company-icon">
              <BriefcaseBusiness size={18} />
            </div>

            <div className="interview-details">
              <h3>{interview.company}</h3>
              <p>
                {interview.role} · {interview.type}
              </p>
            </div>

            <div className="interview-score">
              <strong>{interview.score}%</strong>
              <span>{interview.date}</span>
            </div>

            <Link
              to="/result"
              className="interview-view-button"
            >
              View
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentInterviews;