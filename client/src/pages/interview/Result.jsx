import { useLocation, useNavigate } from "react-router-dom";
import {
  Trophy,
  CheckCircle2,
  Circle,
  RotateCcw,
  Home,
} from "lucide-react";

import "./Result.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const questions = location.state?.questions || [];
  const rawAnswers = location.state?.answers || {};

  const answers = Array.isArray(rawAnswers)
    ? rawAnswers
    : questions.map((question, index) => ({
        question,
        answer: rawAnswers[index] || "",
      }));

  const totalQuestions = questions.length || answers.length;

  const answeredCount = answers.filter(
    (item) => item.answer && item.answer.trim().length > 0
  ).length;

  const score =
    totalQuestions > 0
      ? Math.round((answeredCount / totalQuestions) * 100)
      : 0;

  if (!location.state || totalQuestions === 0) {
    return (
      <div className="result-page">
        <div className="result-container empty-result">
          <h1>No Interview Results Found</h1>

          <p>
            Please complete an interview to view your results.
          </p>

          <button
            className="result-primary-btn"
            onClick={() => navigate("/setup")}
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  const handleRestart = () => {
    navigate("/setup");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="result-page">
      <div className="result-container">
        <div className="result-header">
          <div className="result-icon">
            <Trophy size={40} />
          </div>

          <p className="result-subtitle">
            Interview Completed
          </p>

          <h1>
            {score === 100
              ? "Great Job!"
              : score >= 50
              ? "Good Effort!"
              : "Keep Practicing!"}
          </h1>

          <p className="result-description">
            You completed your mock interview.
          </p>
        </div>

        <div className="score-card">
          <p>Your Completion Score</p>

          <div className="score-circle">
            <span>{score}%</span>
          </div>

          <h2>
            {answeredCount} / {totalQuestions} Questions Answered
          </h2>
        </div>

        <div className="answers-review">
          <h2>Your Responses</h2>

          {answers.map((item, index) => {
            const isAnswered =
              item.answer && item.answer.trim().length > 0;

            return (
              <div
                className="answer-review-card"
                key={index}
              >
                <div className="answer-review-header">
                  <span className="question-number">
                    Question {index + 1}
                  </span>

                  {isAnswered ? (
                    <CheckCircle2
                      size={20}
                      className="answered-icon"
                    />
                  ) : (
                    <Circle
                      size={20}
                      className="unanswered-icon"
                    />
                  )}
                </div>

                <h3>
                  {item.question || `Question ${index + 1}`}
                </h3>

                <p>
                  {isAnswered
                    ? item.answer
                    : "No answer provided"}
                </p>
              </div>
            );
          })}
        </div>

        <div className="result-actions">
          <button
            className="result-secondary-btn"
            onClick={handleDashboard}
          >
            <Home size={18} />
            Dashboard
          </button>

          <button
            className="result-primary-btn"
            onClick={handleRestart}
          >
            <RotateCcw size={18} />
            Try Another Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;