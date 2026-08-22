import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Trophy,
  CheckCircle2,
  Circle,
  RotateCcw,
  Home,
  Loader2,
  Brain,
  ThumbsUp,
  Lightbulb,
} from "lucide-react";

import API from "../../services/api";
import "./Result.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(true);
  const [saveError, setSaveError] = useState("");

  const [evaluating, setEvaluating] = useState(true);
  const [evaluationError, setEvaluationError] = useState("");
  const [evaluation, setEvaluation] = useState(null);

  const hasProcessedInterview = useRef(false);

  const interviewConfig = location.state?.interviewConfig;

  const answers = Array.isArray(location.state?.answers)
    ? location.state.answers
    : [];

  const totalQuestions =
    Number(location.state?.totalQuestions) || answers.length;

  const answeredCount = answers.filter(
    (item) =>
      typeof item.answer === "string" &&
      item.answer.trim().length > 0
  ).length;

  const completionScore =
    totalQuestions > 0
      ? Math.round(
          (answeredCount / totalQuestions) * 100
        )
      : 0;

  useEffect(() => {
    if (
      hasProcessedInterview.current ||
      !interviewConfig ||
      answers.length === 0
    ) {
      return;
    }

    const saveAndEvaluateInterview = async () => {
      hasProcessedInterview.current = true;

      try {
        setSaving(true);
        setSaveError("");
        setEvaluating(true);
        setEvaluationError("");

        const saveResponse = await API.post(
          "/interview/save",
          {
            role: interviewConfig.role,
            experience: interviewConfig.experience,
            difficulty: interviewConfig.difficulty,
            interviewType: interviewConfig.interviewType,
            techStack: interviewConfig.techStack || "",
            company: interviewConfig.company || "",
            totalQuestions,
            answeredQuestions: answeredCount,
            completionScore,
            answers,
          }
        );

        const savedData =
          saveResponse.data?.data ||
          saveResponse.data;

        const interviewId =
          savedData?._id ||
          savedData?.id ||
          savedData?.interviewId ||
          savedData?.interview?._id ||
          savedData?.interview?.id;

        if (!interviewId) {
          throw new Error(
            "Interview was saved, but no Interview ID was returned."
          );
        }

        setSaving(false);

        const evaluationResponse = await API.post(
          "/interview/evaluate",
          {
            interviewId,
          }
        );

        setEvaluation(
          evaluationResponse.data?.data ||
          evaluationResponse.data?.evaluation ||
          null
        );
      } catch (error) {
        console.error(
          "Failed to process interview:",
          error
        );

        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to process your interview.";

        if (
          error.config?.url?.includes("/interview/save")
        ) {
          setSaveError(message);
        } else {
          setEvaluationError(message);
        }

        setSaving(false);
        setEvaluating(false);
      } finally {
        setSaving(false);
        setEvaluating(false);
      }
    };

    saveAndEvaluateInterview();
  }, [
    interviewConfig,
    answers,
    totalQuestions,
    answeredCount,
    completionScore,
  ]);

  if (
    !location.state ||
    !interviewConfig ||
    answers.length === 0
  ) {
    return (
      <div className="result-page">
        <div className="result-container empty-result">
          <h1>No Interview Results Found</h1>

          <p>
            Please complete an interview to view your
            results.
          </p>

          <button
            type="button"
            className="result-primary-btn"
            onClick={() => navigate("/setup")}
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  const aiScore =
    typeof evaluation?.overallScore === "number"
      ? evaluation.overallScore
      : null;

  const displayScore =
    aiScore !== null
      ? aiScore
      : completionScore;

  const getResultMessage = () => {
    if (aiScore === null) {
      return "Interview Completed!";
    }

    if (aiScore >= 80) {
      return "Excellent Work!";
    }

    if (aiScore >= 60) {
      return "Good Job!";
    }

    if (aiScore >= 40) {
      return "Good Effort!";
    }

    return "Keep Practicing!";
  };

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

          <h1>{getResultMessage()}</h1>

          <p className="result-description">
            Your interview responses have been analyzed.
          </p>
        </div>

        <div className="score-card">
          <p>
            {evaluating
              ? "AI is evaluating your interview..."
              : aiScore !== null
              ? "Your AI Interview Score"
              : "Your Completion Score"}
          </p>

          <div className="score-circle">
            {evaluating ? (
              <Loader2
                size={42}
                className="score-loader"
              />
            ) : (
              <span>{displayScore}%</span>
            )}
          </div>

          <h2>
            {answeredCount} / {totalQuestions} Questions
            Answered
          </h2>

          <p className="save-status">
            {saving && "Saving your interview..."}

            {!saving &&
              !saveError &&
              "✓ Interview saved successfully"}

            {!saving &&
              saveError &&
              `⚠ ${saveError}`}
          </p>

          {!evaluating && evaluationError && (
            <p className="evaluation-error">
              ⚠ {evaluationError}
            </p>
          )}
        </div>

        {evaluating && (
          <div className="evaluation-loading">
            <Loader2 size={28} />

            <div>
              <h2>
                AI is analyzing your answers
              </h2>

              <p>
                Evaluating correctness, relevance,
                clarity, and completeness...
              </p>
            </div>
          </div>
        )}

        {!evaluating && evaluation && (
          <section className="ai-feedback-section">

            <div className="ai-section-title">
              <Brain size={25} />

              <div>
                <p>AI Evaluation</p>

                <h2>
                  Your Interview Feedback
                </h2>
              </div>
            </div>

            <div className="ai-summary-card">
              <h3>Overall Summary</h3>

              <p>
                {evaluation.summary ||
                  "Your interview has been evaluated successfully."}
              </p>
            </div>

            <div className="feedback-grid">

              <div className="feedback-card strengths-card">
                <div className="feedback-card-title">
                  <ThumbsUp size={21} />

                  <h3>Your Strengths</h3>
                </div>

                {Array.isArray(evaluation.strengths) &&
                evaluation.strengths.length > 0 ? (
                  <ul>
                    {evaluation.strengths.map(
                      (strength, index) => (
                        <li key={index}>
                          {strength}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>
                    Complete more detailed answers to
                    identify your strengths.
                  </p>
                )}
              </div>

              <div className="feedback-card improvements-card">
                <div className="feedback-card-title">
                  <Lightbulb size={21} />

                  <h3>Areas to Improve</h3>
                </div>

                {Array.isArray(
                  evaluation.improvements
                ) &&
                evaluation.improvements.length > 0 ? (
                  <ul>
                    {evaluation.improvements.map(
                      (improvement, index) => (
                        <li key={index}>
                          {improvement}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>
                    Keep practicing to improve your
                    interview performance.
                  </p>
                )}
              </div>

            </div>

          </section>
        )}

        <div className="answers-review">
          <h2>Your Responses</h2>

          {answers.map((item, index) => {
            const isAnswered =
              typeof item.answer === "string" &&
              item.answer.trim().length > 0;

            const questionFeedback =
              evaluation?.questionFeedback?.[index];

            return (
              <div
                className="answer-review-card"
                key={index}
              >
                <div className="answer-review-header">
                  <span className="question-number">
                    Question {index + 1}
                  </span>

                  <div className="question-status">
                    {!evaluating &&
                      typeof questionFeedback?.score ===
                        "number" && (
                        <span className="question-score">
                          {questionFeedback.score}%
                        </span>
                      )}

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
                </div>

                <h3>{item.question}</h3>

                <div className="answer-box">
                  {isAnswered
                    ? item.answer
                    : "No answer provided"}
                </div>

                {!evaluating &&
                  questionFeedback?.feedback && (
                    <div className="question-feedback">
                      <h4>AI Feedback</h4>

                      <p>
                        {questionFeedback.feedback}
                      </p>
                    </div>
                  )}
              </div>
            );
          })}
        </div>

        <div className="result-actions">
          <button
            type="button"
            className="result-secondary-btn"
            onClick={handleDashboard}
          >
            <Home size={18} />
            Dashboard
          </button>

          <button
            type="button"
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