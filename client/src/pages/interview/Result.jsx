import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Trophy,
  CheckCircle2,
  Circle,
  RotateCcw,
  Home,
} from "lucide-react";

import API from "../../services/api";
import "./Result.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(true);
  const [saveError, setSaveError] = useState("");

  // Prevent duplicate API calls in React StrictMode
  const hasSavedInterview = useRef(false);

  const interviewConfig = location.state?.interviewConfig;
  const answers = location.state?.answers || [];

  const totalQuestions =
    Number(location.state?.totalQuestions) || answers.length;

  const answeredCount = answers.filter(
    (item) => item.answer?.trim().length > 0
  ).length;

  const completionScore =
    totalQuestions > 0
      ? Math.round((answeredCount / totalQuestions) * 100)
      : 0;

  useEffect(() => {
    if (hasSavedInterview.current) {
      return;
    }

    if (
      !interviewConfig ||
      !Array.isArray(answers) ||
      answers.length === 0
    ) {
      setSaving(false);
      return;
    }

    const saveCompletedInterview = async () => {
      hasSavedInterview.current = true;

      try {
        setSaving(true);
        setSaveError("");

        await API.post("/interview/save", {
          role: interviewConfig.role,
          experience: interviewConfig.experience,
          difficulty: interviewConfig.difficulty,
          interviewType: interviewConfig.interviewType,
          techStack: interviewConfig.techStack,
          totalQuestions,
          answeredQuestions: answeredCount,
          completionScore,
          answers,
        });

        setSaving(false);
      } catch (error) {
        console.error("Failed to save interview:", error);

        // Allow retry only if saving failed
        hasSavedInterview.current = false;

        setSaveError(
          error.response?.data?.message ||
            "Failed to save your interview."
        );

        setSaving(false);
      }
    };

    saveCompletedInterview();
  }, []);

  if (
    !location.state ||
    !interviewConfig ||
    !Array.isArray(answers) ||
    answers.length === 0
  ) {
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
            {completionScore === 100
              ? "Excellent Work!"
              : completionScore >= 50
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
            <span>{completionScore}%</span>
          </div>

          <h2>
            {answeredCount} / {totalQuestions} Questions Answered
          </h2>

          <p className="save-status">
            {saving && "Saving your interview..."}

            {!saving && !saveError &&
              "✓ Interview saved successfully"}

            {!saving && saveError &&
              `⚠ ${saveError}`}
          </p>
        </div>

        <div className="answers-review">
          <h2>Your Responses</h2>

          {answers.map((item, index) => {
            const isAnswered =
              item.answer?.trim().length > 0;

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

                <h3>{item.question}</h3>

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