import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  ChevronRight,
  Clock3,
  FileText,
} from "lucide-react";

import "./RecentInterviews.css";

const normalizeCompanyName = (company) => {
  if (!company || typeof company !== "string") {
    return "";
  }

  return company
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

const formatCompanyName = (company) => {
  if (!company || !company.trim()) {
    return "MockMate Interview";
  }

  return company.trim();
};

const getCompanyInitials = (company) => {
  const normalizedName = normalizeCompanyName(company);

  const initials = {
    microsoft: "M",
    amazon: "a",
    google: "G",
    meta: "M",
    apple: "A",
    netflix: "N",
    adobe: "A",
    spotify: "S",
    uber: "U",
    airbnb: "A",
    tesla: "T",
    linkedin: "in",
    samsung: "S",
    intel: "i",
    ibm: "IBM",
    oracle: "O",
    salesforce: "S",
    nvidia: "N",
    paypal: "P",
    walmart: "W",
    atlassian: "A",
    accenture: ">",
    infosys: "I",
    tcs: "T",
    wipro: "W",
  };

  return initials[normalizedName] || null;
};

const getCompanyColors = (company) => {
  const normalizedName = normalizeCompanyName(company);

  const colors = {
    microsoft: {
      background:
        "linear-gradient(135deg, #f25022 0%, #f25022 48%, #7fba00 48%, #7fba00 100%)",
      color: "#ffffff",
    },

    amazon: {
      background: "#ff9900",
      color: "#111827",
    },

    google: {
      background: "#ffffff",
      color: "#4285f4",
    },

    meta: {
      background: "#0866ff",
      color: "#ffffff",
    },

    apple: {
      background: "#111827",
      color: "#ffffff",
    },

    netflix: {
      background: "#e50914",
      color: "#ffffff",
    },

    adobe: {
      background: "#ff0000",
      color: "#ffffff",
    },

    spotify: {
      background: "#1db954",
      color: "#ffffff",
    },

    uber: {
      background: "#000000",
      color: "#ffffff",
    },

    airbnb: {
      background: "#ff5a5f",
      color: "#ffffff",
    },

    tesla: {
      background: "#e82127",
      color: "#ffffff",
    },

    linkedin: {
      background: "#0a66c2",
      color: "#ffffff",
    },

    samsung: {
      background: "#1428a0",
      color: "#ffffff",
    },

    intel: {
      background: "#0071c5",
      color: "#ffffff",
    },

    ibm: {
      background: "#0f62fe",
      color: "#ffffff",
    },

    oracle: {
      background: "#f80000",
      color: "#ffffff",
    },

    salesforce: {
      background: "#00a1e0",
      color: "#ffffff",
    },

    nvidia: {
      background: "#76b900",
      color: "#ffffff",
    },

    paypal: {
      background: "#003087",
      color: "#ffffff",
    },

    walmart: {
      background: "#0071ce",
      color: "#ffc220",
    },

    atlassian: {
      background: "#1868db",
      color: "#ffffff",
    },

    accenture: {
      background: "#a100ff",
      color: "#ffffff",
    },

    infosys: {
      background: "#007cc3",
      color: "#ffffff",
    },

    tcs: {
      background: "#1d4ed8",
      color: "#ffffff",
    },

    wipro: {
      background: "#7c3aed",
      color: "#ffffff",
    },
  };

  return (
    colors[normalizedName] || {
      background:
        "linear-gradient(135deg, #7c3aed, #4f46e5)",
      color: "#ffffff",
    }
  );
};

const getRelativeTime = (date) => {
  if (!date) {
    return "";
  }

  const interviewDate = new Date(date);

  if (Number.isNaN(interviewDate.getTime())) {
    return "";
  }

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

const MicrosoftLogo = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2px",
        width: "24px",
        height: "24px",
      }}
    >
      <span style={{ background: "#f25022" }} />
      <span style={{ background: "#7fba00" }} />
      <span style={{ background: "#00a4ef" }} />
      <span style={{ background: "#ffb900" }} />
    </div>
  );
};

const CompanyIcon = ({ company }) => {
  const normalizedName =
    normalizeCompanyName(company);

  const initials =
    getCompanyInitials(company);

  const colors =
    getCompanyColors(company);

  if (!initials) {
    return (
      <BriefcaseBusiness
        size={21}
        strokeWidth={1.9}
        className="company-fallback-icon"
      />
    );
  }

  if (normalizedName === "microsoft") {
    return <MicrosoftLogo />;
  }

  return (
    <div
      className="company-logo"
      title={formatCompanyName(company)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "27px",
        height: "27px",
        borderRadius: "7px",
        background: colors.background,
        color: colors.color,
        fontSize:
          initials.length > 2 ? "7px" : "16px",
        fontWeight: "800",
        lineHeight: "1",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        letterSpacing:
          initials.length > 2 ? "-0.5px" : "0",
      }}
    >
      {initials}
    </div>
  );
};

const RecentInterviews = () => {
  const [interviews, setInterviews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchRecentInterviews = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/interview/history",
          {
            headers: {
              Authorization: token
                ? `Bearer ${token}`
                : "",
            },
          }
        );

        const result =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to fetch interviews."
          );
        }

        const allInterviews =
          Array.isArray(result.data)
            ? result.data
            : [];

        const recentInterviews =
          [...allInterviews]
            .sort((a, b) => {
              const firstDate =
                new Date(
                  a.createdAt || 0
                ).getTime();

              const secondDate =
                new Date(
                  b.createdAt || 0
                ).getTime();

              return secondDate - firstDate;
            })
            .slice(0, 5);

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
          {interviews.map((interview, index) => {
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
                key={
                  interview._id ||
                  `${companyName}-${index}`
                }
              >
                <div className="interview-company-icon">
                  <CompanyIcon
                    company={interview.company}
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

                {interview._id ? (
                  <Link
                    to={`/history/${interview._id}`}
                    className="interview-view-button"
                    aria-label={`View ${companyName} interview`}
                  >
                    <span>View</span>

                    <ChevronRight size={16} />
                  </Link>
                ) : (
                  <span className="interview-view-button">
                    <span>View</span>

                    <ChevronRight size={16} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecentInterviews;