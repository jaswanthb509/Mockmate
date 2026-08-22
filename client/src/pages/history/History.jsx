import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Loader2,
  Plus,
  Trophy,
  Building2,
} from "lucide-react";

import API from "../../services/api";
import "./History.css";

const History = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviewHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/interview/history");

        setInterviews(response.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch interview history:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load your interview history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewHistory();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScore = (interview) => {
    if (
      interview.evaluation &&
      typeof interview.evaluation.overallScore === "number"
    ) {
      return interview.evaluation.overallScore;
    }

    return interview.completionScore || 0;
  };

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <div className="history-header-content">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>

            <span className="history-eyebrow">
              YOUR PROGRESS
            </span>

            <h1>Interview History</h1>

            <p>
              Review your previous mock interviews and track your
              improvement over time.
            </p>
          </div>

          <button
            type="button"
            className="new-interview-button"
            onClick={() => navigate("/setup")}
          >
            <Plus size={18} />
            New Interview
          </button>
        </div>

        {loading && (
          <div className="history-state-card">
            <Loader2
              size={34}
              className="loading-icon"
            />

            <h2>Loading your interviews</h2>

            <p>
              Please wait while we retrieve your interview history.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="history-error-card">
            <h2>Unable to load history</h2>

            <p>{error}</p>

            <button
              type="button"
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && interviews.length === 0 && (
          <div className="history-state-card empty-history">
            <div className="empty-history-icon">
              <FileText size={42} />
            </div>

            <h2>No Interviews Yet</h2>

            <p>
              Complete your first AI mock interview to start tracking
              your performance and improvement.
            </p>

            <button
              type="button"
              className="new-interview-button"
              onClick={() => navigate("/setup")}
            >
              <Plus size={18} />
              Start Your First Interview
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          interviews.length > 0 && (
            <>
              <div className="history-summary">
                <div className="summary-item">
                  <span>Total Interviews</span>
                  <strong>{interviews.length}</strong>
                </div>

                <div className="summary-item">
                  <span>Best Score</span>
                  <strong>
                    {Math.max(
                      ...interviews.map((interview) =>
                        getScore(interview)
                      )
                    )}
                    %
                  </strong>
                </div>

                <div className="summary-item">
                  <span>Latest Interview</span>
                  <strong>
                    {formatDate(interviews[0]?.createdAt)}
                  </strong>
                </div>
              </div>

              <div className="history-grid">
                {interviews.map((interview) => {
                  const score = getScore(interview);
                  const isEvaluated =
                    interview.evaluation &&
                    interview.evaluation.evaluatedAt;

                  return (
                    <div
                      className="history-card"
                      key={interview._id}
                    >
                      <div className="history-card-top">
                        <div className="history-icon">
                          <Trophy size={22} />
                        </div>

                        <div
                          className={`history-score ${
                            isEvaluated
                              ? "evaluated"
                              : "completion"
                          }`}
                        >
                          {score}%
                        </div>
                      </div>

                      <div className="history-card-title">
                        <h2>{interview.role}</h2>

                        {interview.company && (
                          <p className="history-company">
                            <Building2 size={14} />
                            {interview.company}
                          </p>
                        )}
                      </div>

                      <div className="history-tags">
                        <span>
                          {interview.interviewType}
                        </span>

                        <span>
                          {interview.difficulty}
                        </span>

                        <span>
                          {interview.experience}
                        </span>
                      </div>

                      {interview.techStack && (
                        <div className="history-tech">
                          <span>Tech Stack</span>

                          <p>{interview.techStack}</p>
                        </div>
                      )}

                      <div className="history-divider" />

                      <div className="history-stats">
                        <div>
                          <FileText size={16} />

                          <span>
                            {interview.answeredQuestions} /{" "}
                            {interview.totalQuestions} answered
                          </span>
                        </div>

                        <div>
                          <Calendar size={16} />

                          <span>
                            {formatDate(interview.createdAt)}
                          </span>
                        </div>

                        <div>
                          <Clock size={16} />

                          <span>
                            {formatTime(interview.createdAt)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="view-interview-button"
                        onClick={() =>
                          navigate(
                            `/history/${interview._id}`
                          )
                        }
                      >
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default History;