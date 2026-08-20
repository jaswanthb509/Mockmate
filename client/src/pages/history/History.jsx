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
} from "lucide-react";

import "./History.css";

const History = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviewHistory = async () => {
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

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch interview history"
          );
        }

        setInterviews(data.data || []);
      } catch (error) {
        console.error("History Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewHistory();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <div>
            <button
              className="back-button"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>

            <h1>Interview History</h1>
            <p>Review all your previous mock interviews.</p>
          </div>

          <button
            className="new-interview-button"
            onClick={() => navigate("/setup")}
          >
            <Plus size={18} />
            New Interview
          </button>
        </div>

        {loading && (
          <div className="history-loading">
            <Loader2 size={32} className="loading-icon" />
            <p>Loading your interview history...</p>
          </div>
        )}

        {!loading && error && (
          <div className="history-error">
            {error}
          </div>
        )}

        {!loading && !error && interviews.length === 0 && (
          <div className="empty-history">
            <FileText size={48} />

            <h2>No Interviews Yet</h2>

            <p>
              You haven't completed any mock interviews yet.
              Start your first interview to see your progress here.
            </p>

            <button
              className="new-interview-button"
              onClick={() => navigate("/setup")}
            >
              <Plus size={18} />
              Start Your First Interview
            </button>
          </div>
        )}

        {!loading && !error && interviews.length > 0 && (
          <div className="history-grid">
            {interviews.map((interview) => (
              <div
                className="history-card"
                key={interview._id}
              >
                <div className="history-card-top">
                  <div className="history-icon">
                    <Trophy size={22} />
                  </div>

                  <span className="history-score">
                    {interview.completionScore}%
                  </span>
                </div>

                <h2>{interview.role}</h2>

                <div className="history-tags">
                  <span>{interview.interviewType}</span>
                  <span>{interview.difficulty}</span>
                  <span>{interview.experience}</span>
                </div>

                {interview.techStack && (
                  <p className="history-tech">
                    {interview.techStack}
                  </p>
                )}

                <div className="history-stats">
                  <div>
                    <FileText size={16} />
                    <span>
                      {interview.answeredQuestions} /{" "}
                      {interview.totalQuestions} Answered
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
                  className="view-interview-button"
                  onClick={() =>
                    navigate(`/history/${interview._id}`)
                  }
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;