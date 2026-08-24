import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  BriefcaseBusiness,
  ChevronRight,
  Clock3,
  FileText,
} from "lucide-react";

import {
  SiAmazon,
  SiMicrosoft,
  SiGoogle,
  SiMeta,
  SiApple,
  SiNetflix,
  SiSpotify,
  SiUber,
  SiAirbnb,
} from "react-icons/si";

import "./RecentInterviews.css";

const getCompanyIcon = (company) => {
  const companyName = company?.trim().toLowerCase();

  const companyIcons = {
    amazon: SiAmazon,
    microsoft: SiMicrosoft,
    google: SiGoogle,
    meta: SiMeta,
    apple: SiApple,
    netflix: SiNetflix,
    spotify: SiSpotify,
    uber: SiUber,
    airbnb: SiAirbnb,
  };

  return companyIcons[companyName] || BriefcaseBusiness;
};

const formatCompanyName = (company) => {
  if (!company || !company.trim()) {
    return "MockMate Interview";
  }

  return company
    .trim()
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};

const getRelativeTime = (date) => {
  if (!date) {
    return "";
  }

  const interviewDate = new Date(date);
  const currentDate = new Date();

  const difference =
    currentDate.getTime() -
    interviewDate.getTime();

  const minutes = Math.floor(
    difference / (1000 * 60)
  );

  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours < 24) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    } ago`;
  }

  if (days < 7) {
    return `${days} ${
      days === 1 ? "day" : "days"
    } ago`;
  }

  return interviewDate.toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year:
        interviewDate.getFullYear() !==
        currentDate.getFullYear()
          ? "numeric"
          : undefined,
    }
  );
};

const getScoreClass = (score) => {
  if (score >= 80) {
    return "score-excellent";
  }

  if (score >= 60) {
    return "score-good";
  }

  return "score-needs-work";
};

const RecentInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentInterviews = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/interview/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to fetch interviews."
          );
        }

        const recentInterviews = Array.isArray(
          result.data
        )
          ? result.data.slice(0, 5)
          : [];

        setInterviews(recentInterviews);
      } catch (error) {
        console.error(
          "Failed to fetch recent interviews:",
          error
        );

        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentInterviews();
  }, []);

  return (
    <section className="recent-interviews">
      <div className="recent-interviews-top">
        <div>
          <p className="recent-section-label">
            LATEST ACTIVITY
          </p>

          <p className="recent-subtitle">
            Your most recent interview sessions
            and evaluation results.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="recent-interviews-state">
          Loading recent interviews...
        </div>
      ) : interviews.length === 0 ? (
        <div className="recent-empty-state">
          <div className="recent-empty-icon">
            <FileText size={22} />
          </div>

          <div>
            <h3>No interviews yet</h3>

            <p>
              Complete your first mock interview
              to see your activity here.
            </p>
          </div>

          <Link
            to="/setup"
            className="recent-start-button"
          >
            Start Interview
            <ChevronRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="interview-list">
          {interviews.map((interview) => {
            const CompanyIcon =
              getCompanyIcon(interview.company);

            const companyName =
              formatCompanyName(
                interview.company
              );

            const score =
              interview.evaluation?.overallScore;

            const hasEvaluation =
              typeof score === "number";

            return (
              <div
                className="interview-row"
                key={interview._id}
              >
                <div className="interview-company-icon">
                  <CompanyIcon
                    size={21}
                    strokeWidth={1.9}
                  />
                </div>

                <div className="interview-details">
                  <div className="interview-title-row">
                    <h3>{companyName}</h3>

                    <span className="interview-type">
                      {interview.interviewType ||
                        "Mock Interview"}
                    </span>
                  </div>

                  <p>
                    {interview.role ||
                      "Interview Practice"}
                  </p>
                </div>

                <div className="interview-result">
                  {hasEvaluation ? (
                    <>
                      <span className="result-label">
                        Score
                      </span>

                      <strong
                        className={getScoreClass(
                          score
                        )}
                      >
                        {Math.round(score)}%
                      </strong>
                    </>
                  ) : (
                    <div className="pending-badge">
                      <Clock3 size={14} />
                      <span>Pending</span>
                    </div>
                  )}
                </div>

                <div className="interview-date">
                  {getRelativeTime(
                    interview.createdAt
                  )}
                </div>

                <Link
                  to={`/history/${interview._id}`}
                  className="interview-view-button"
                  aria-label={`View ${companyName} interview`}
                >
                  <span>View</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecentInterviews;