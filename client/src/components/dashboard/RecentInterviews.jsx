import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronRight,
} from "lucide-react";

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
          <p className="section-label">Interview Activity</p>
          <h2>Your Recent Interviews:</h2>
          <p className="recent-subtitle">
            Review your latest interview sessions and performance.
          </p>
        </div>

        <Link
          to="/history"
          className="view-all-link"
        >
          View all
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="interview-list">
        {interviews.map((interview, index) => (
          <div className="interview-row" key={index}>
            <div className="interview-company-icon">
              <BriefcaseBusiness size={19} />
            </div>

            <div className="interview-details">
              <div className="interview-title-row">
                <h3>{interview.company}</h3>

                <span className="interview-type">
                  {interview.type}
                </span>
              </div>

              <p>{interview.role}</p>
            </div>

            <div className="interview-score">
              <span className="score-label">Score</span>
              <strong>{interview.score}%</strong>
            </div>

            <div className="interview-date">
              {interview.date}
            </div>

            <Link
              to="/result"
              className="interview-view-button"
              aria-label={`View ${interview.company} interview`}
            >
              <span>View</span>
              <ChevronRight size={15} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentInterviews;