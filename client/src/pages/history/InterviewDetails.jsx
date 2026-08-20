import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  Trophy,
} from "lucide-react";

import API from "../../services/api";
import "./InterviewDetails.css";

const InterviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/interview/${id}`);

        setInterview(response.data.data);
      } catch (error) {
        console.error("Failed to fetch interview details:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load interview details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-loading">
          <Loader2 size={36} className="details-spinner" />
          <p>Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="details-page">
        <div className="details-error">
          <h2>Unable to Load Interview</h2>

          <p>{error || "Interview not found."}</p>

          <button
            className="details-back-btn"
            onClick={() => navigate("/history")}
          >
            <ArrowLeft size={18} />
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = interview.answers.filter(
    (item) => item.answer?.trim().length > 0
  ).length;

  return (
    <div className="details-page">
      <div className="details-container">

        <button
          className="details-back-btn"
          onClick={() => navigate("/history")}
        >
          <ArrowLeft size={18} />
          Back to History
        </button>

        <div className="details-header">
          <div>
            <p className="details-label">INTERVIEW DETAILS</p>

            <h1>{interview.role}</h1>

            <div className="details-tags">
              <span>{interview.interviewType}</span>
              <span>{interview.difficulty}</span>
              <span>{interview.experience}</span>
            </div>
          </div>

          <div className="details-score">
            <Trophy size={24} />
            <div>
              <span>Completion Score</span>
              <strong>{interview.completionScore}%</strong>
            </div>
          </div>
        </div>

        <div className="details-summary">
          <div className="summary-item">
            <CheckCircle2 size={20} />
            <div>
              <span>Questions Answered</span>
              <strong>
                {answeredCount} / {interview.totalQuestions}
              </strong>
            </div>
          </div>

          <div className="summary-item">
            <Calendar size={20} />
            <div>
              <span>Date</span>
              <strong>{formatDate(interview.createdAt)}</strong>
            </div>
          </div>

          <div className="summary-item">
            <Clock size={20} />
            <div>
              <span>Time</span>
              <strong>{formatTime(interview.createdAt)}</strong>
            </div>
          </div>
        </div>

        {interview.techStack && (
          <div className="details-tech">
            <span>Technology Stack</span>
            <strong>{interview.techStack}</strong>
          </div>
        )}

        <section className="details-answers">
          <h2>Questions & Your Answers</h2>

          {interview.answers.map((item, index) => {
            const isAnswered =
              item.answer?.trim().length > 0;

            return (
              <div
                className="details-answer-card"
                key={index}
              >
                <div className="details-question-header">
                  <span>Question {index + 1}</span>

                  {isAnswered ? (
                    <div className="answer-status answered">
                      <CheckCircle2 size={16} />
                      Answered
                    </div>
                  ) : (
                    <div className="answer-status unanswered">
                      <Circle size={16} />
                      Not Answered
                    </div>
                  )}
                </div>

                <h3>{item.question}</h3>

                <div className="details-answer-text">
                  {isAnswered
                    ? item.answer
                    : "No answer was provided for this question."}
                </div>
              </div>
            );
          })}
        </section>

      </div>
    </div>
  );
};

export default InterviewDetails;