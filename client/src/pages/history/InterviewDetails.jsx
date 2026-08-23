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
  Brain,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Building2,
  RefreshCw,
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

        const interviewData = response.data?.data;

        if (!interviewData) {
          throw new Error("Interview data was not found.");
        }

        setInterview(interviewData);
      } catch (error) {
        console.error(
          "Failed to fetch interview details:",
          error
        );

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load interview details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }

    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) {
      return "N/A";
    }

    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-loading">
          <Loader2
            size={36}
            className="details-spinner"
          />

          <p>Loading your interview results...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="details-page">
        <div className="details-error">
          <AlertCircle size={40} />

          <h2>Unable to Load Interview</h2>

          <p>
            {error || "Interview not found."}
          </p>

          <button
            type="button"
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

  const answers = Array.isArray(interview.answers)
    ? interview.answers
    : [];

  const answeredCount = answers.filter(
    (item) =>
      typeof item.answer === "string" &&
      item.answer.trim().length > 0
  ).length;

  const evaluation =
    interview.evaluation &&
    typeof interview.evaluation === "object"
      ? interview.evaluation
      : null;

  const hasEvaluation =
    evaluation &&
    (
      evaluation.evaluatedAt ||
      typeof evaluation.overallScore === "number" ||
      evaluation.summary ||
      evaluation.strengths?.length > 0 ||
      evaluation.improvements?.length > 0 ||
      evaluation.questionFeedback?.length > 0
    );

  const overallScore =
    hasEvaluation &&
    typeof evaluation.overallScore === "number"
      ? evaluation.overallScore
      : interview.completionScore || 0;

  const questionFeedbackList =
    Array.isArray(evaluation?.questionFeedback)
      ? evaluation.questionFeedback
      : [];

  return (
    <div className="details-page">
      <div className="details-container">
        <div className="details-topbar">
          <button
            type="button"
            className="details-back-btn"
            onClick={() => navigate("/history")}
          >
            <ArrowLeft size={18} />
            Back to History
          </button>

          <button
            type="button"
            className="details-new-interview-btn"
            onClick={() => navigate("/setup")}
          >
            <Sparkles size={17} />
            New Interview
          </button>
        </div>

        <section className="details-header">
          <div>
            <p className="details-label">
              AI INTERVIEW REPORT
            </p>

            <h1>{interview.role || "Mock Interview"}</h1>

            {interview.company && (
              <div className="details-company">
                <Building2 size={16} />
                <span>{interview.company}</span>
              </div>
            )}

            <div className="details-tags">
              {interview.interviewType && (
                <span>{interview.interviewType}</span>
              )}

              {interview.difficulty && (
                <span>{interview.difficulty}</span>
              )}

              {interview.experience && (
                <span>{interview.experience}</span>
              )}
            </div>
          </div>

          <div className="details-score">
            <Trophy size={26} />

            <div>
              <span>
                {hasEvaluation
                  ? "AI Evaluation Score"
                  : "Completion Score"}
              </span>

              <strong>{overallScore}%</strong>
            </div>
          </div>
        </section>

        <section className="details-summary">
          <div className="summary-item">
            <CheckCircle2 size={20} />

            <div>
              <span>Questions Answered</span>

              <strong>
                {answeredCount} / {interview.totalQuestions || 0}
              </strong>
            </div>
          </div>

          <div className="summary-item">
            <Calendar size={20} />

            <div>
              <span>Interview Date</span>

              <strong>
                {formatDate(interview.createdAt)}
              </strong>
            </div>
          </div>

          <div className="summary-item">
            <Clock size={20} />

            <div>
              <span>Interview Time</span>

              <strong>
                {formatTime(interview.createdAt)}
              </strong>
            </div>
          </div>
        </section>

        {interview.techStack && (
          <section className="details-tech">
            <span>Technology Stack</span>

            <strong>{interview.techStack}</strong>
          </section>
        )}

        {hasEvaluation ? (
          <>
            <section className="ai-summary-section">
              <div className="section-title">
                <Brain size={22} />

                <div>
                  <p>AI EVALUATION</p>

                  <h2>Your Performance Summary</h2>
                </div>
              </div>

              <div className="ai-summary-card">
                {evaluation.summary ||
                  "Your interview has been evaluated successfully."}
              </div>
            </section>

            <section className="feedback-grid">
              <div className="feedback-card strengths-card">
                <div className="feedback-card-title">
                  <TrendingUp size={21} />

                  <h3>Strengths</h3>
                </div>

                {Array.isArray(evaluation.strengths) &&
                evaluation.strengths.length > 0 ? (
                  <ul>
                    {evaluation.strengths.map(
                      (strength, index) => (
                        <li key={index}>
                          <CheckCircle2 size={16} />

                          <span>{strength}</span>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="empty-feedback">
                    No strengths were generated.
                  </p>
                )}
              </div>

              <div className="feedback-card improvements-card">
                <div className="feedback-card-title">
                  <AlertCircle size={21} />

                  <h3>Areas for Improvement</h3>
                </div>

                {Array.isArray(evaluation.improvements) &&
                evaluation.improvements.length > 0 ? (
                  <ul>
                    {evaluation.improvements.map(
                      (improvement, index) => (
                        <li key={index}>
                          <AlertCircle size={16} />

                          <span>{improvement}</span>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="empty-feedback">
                    No improvement suggestions were generated.
                  </p>
                )}
              </div>
            </section>
          </>
        ) : (
          <section className="ai-summary-section">
            <div className="section-title">
              <Brain size={22} />

              <div>
                <p>AI EVALUATION</p>

                <h2>Evaluation Not Available</h2>
              </div>
            </div>

            <div className="ai-summary-card">
              This interview does not currently have a saved AI
              evaluation report.
            </div>
          </section>
        )}

        <section className="details-answers">
          <div className="answers-section-header">
            <div>
              <p>DETAILED REVIEW</p>

              <h2>Questions & Your Answers</h2>
            </div>

            <span>
              {answeredCount} answered
            </span>
          </div>

          {answers.length === 0 ? (
            <div className="details-answer-card">
              <p className="empty-feedback">
                No questions or answers were found for this interview.
              </p>
            </div>
          ) : (
            answers.map((item, index) => {
              const isAnswered =
                typeof item.answer === "string" &&
                item.answer.trim().length > 0;

              const questionFeedback =
                questionFeedbackList[index];

              return (
                <div
                  className="details-answer-card"
                  key={index}
                >
                  <div className="details-question-header">
                    <span>
                      Question {index + 1}
                    </span>

                    <div className="question-status-group">
                      {questionFeedback &&
                        typeof questionFeedback.score ===
                          "number" && (
                          <span className="question-score">
                            {questionFeedback.score}/100
                          </span>
                        )}

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
                  </div>

                  <h3>{item.question}</h3>

                  <div className="answer-label">
                    Your Answer
                  </div>

                  <div className="details-answer-text">
                    {isAnswered
                      ? item.answer
                      : "No answer was provided for this question."}
                  </div>

                  {hasEvaluation && questionFeedback && (
                    <div className="question-feedback">
                      <div className="question-feedback-header">
                        <Brain size={18} />

                        <span>AI Feedback</span>
                      </div>

                      <p>
                        {questionFeedback.feedback ||
                          "No specific feedback was generated for this answer."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
};

export default InterviewDetails;