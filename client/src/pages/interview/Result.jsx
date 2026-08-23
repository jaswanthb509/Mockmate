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

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [evaluating, setEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState("");
  const [evaluation, setEvaluation] = useState(null);

  const hasProcessedInterview = useRef(false);

  const interviewConfig = location.state?.interviewConfig;

  const answers = Array.isArray(location.state?.answers)
    ? location.state.answers
    : [];

  const totalQuestions =
    Number(location.state?.totalQuestions) || answers.length;

  const answeredCount = answers.filter((item) => {
    return (
      typeof item.answer === "string" &&
      item.answer.trim().length > 0
    );
  }).length;

  const completionScore =
    totalQuestions > 0
      ? Math.round((answeredCount / totalQuestions) * 100)
      : 0;

  useEffect(() => {
    if (
      hasProcessedInterview.current ||
      !interviewConfig ||
      answers.length === 0
    ) {
      return;
    }

    const processInterview = async () => {
      hasProcessedInterview.current = true;

      let interviewId = null;

      try {
        setSaving(true);
        setSaveError("");

        const saveResponse = await API.post("/interview/save", {
          role: interviewConfig.role,
          company: interviewConfig.company || "",
          experience: interviewConfig.experience,
          difficulty: interviewConfig.difficulty,
          interviewType: interviewConfig.interviewType,
          techStack: interviewConfig.techStack || "",
          totalQuestions,
          answeredQuestions: answeredCount,
          completionScore,
          answers,
        });

        const savedInterview =
          saveResponse.data?.data ||
          saveResponse.data?.interview ||
          saveResponse.data;

        interviewId =
          savedInterview?._id ||
          savedInterview?.id ||
          savedInterview?.interviewId;

        if (!interviewId) {
          throw new Error(
            "Interview was saved, but the interview ID was not returned."
          );
        }

        setSaving(false);
      } catch (error) {
        console.error("Interview save error:", error);

        setSaveError(
          error.response?.data?.message ||
            error.message ||
            "Could not save the interview."
        );

        setSaving(false);
        return;
      }

      try {
        setEvaluating(true);
        setEvaluationError("");

        const evaluationResponse = await API.post(
          "/interview/evaluate",
          {
            interviewId,
          }
        );

        const evaluationData =
          evaluationResponse.data?.data ||
          evaluationResponse.data?.evaluation ||
          evaluationResponse.data;

        setEvaluation(evaluationData);
      } catch (error) {
        console.error("AI evaluation error:", error);

        setEvaluationError(
          error.response?.data?.message ||
            error.message ||
            "AI evaluation could not be completed."
        );
      } finally {
        setEvaluating(false);
      }
    };

    processInterview();
  }, []);

  if (!location.state || !interviewConfig || answers.length === 0) {
    return (
      <div className="result-page">
        <div className="result-container empty-result">
          <div className="result-icon">
            <Trophy size={38} />
          </div>

          <h1>No Interview Results Found</h1>

          <p>
            Please complete an interview to view your results.
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
      : typeof evaluation?.score === "number"
      ? evaluation.score
      : null;

  const displayScore =
    aiScore !== null ? aiScore : completionScore;

  const overallFeedback =
    evaluation?.overallFeedback ||
    evaluation?.summary ||
    evaluation?.feedback ||
    "";

  const strengths = Array.isArray(evaluation?.strengths)
    ? evaluation.strengths
    : [];

  const improvements = Array.isArray(
    evaluation?.improvements
  )
    ? evaluation.improvements
    : Array.isArray(evaluation?.areasToImprove)
    ? evaluation.areasToImprove
    : [];

  const questionFeedback = Array.isArray(
    evaluation?.questionFeedback
  )
    ? evaluation.questionFeedback
    : Array.isArray(evaluation?.questionEvaluations)
    ? evaluation.questionEvaluations
    : [];

  const handleTryAgain = () => {
    navigate("/setup");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="result-page">
      <div className="result-container">
        <header className="result-header">
          <div className="result-icon">
            <Trophy size={38} />
          </div>

          <p className="result-subtitle">
            Interview Completed
          </p>

          <h1>Interview Completed!</h1>

          <p className="result-description">
            {evaluating
              ? "Your answers are being analyzed by AI. Please wait a moment."
              : evaluation
              ? "Your AI evaluation report is ready and has been saved to your interview history."
              : "Your interview has been completed successfully."}
          </p>
        </header>

        <section className="score-card">
          <p className="score-label">
            {evaluating
              ? "AI Evaluation in Progress"
              : aiScore !== null
              ? "Your AI Interview Score"
              : "Your Completion Score"}
          </p>

          <div className="score-circle">
            {evaluating ? (
              <Loader2
                size={52}
                className="score-loader"
              />
            ) : (
              <span>{displayScore}%</span>
            )}
          </div>

          <h2>
            {answeredCount} / {totalQuestions} Questions Answered
          </h2>

          {saving && (
            <p className="save-status saving-status">
              <Loader2
                size={16}
                className="save-loader"
              />
              Saving interview...
            </p>
          )}

          {!saving && !saveError && (
            <p className="save-status">
              <CheckCircle2 size={16} />
              Interview saved successfully
            </p>
          )}

          {saveError && (
            <p className="evaluation-error">
              {saveError}
            </p>
          )}

          {evaluating && (
            <div className="score-loading-text">
              <Loader2
                size={17}
                className="small-loader"
              />
              <span>Generating your AI evaluation...</span>
            </div>
          )}

          {!evaluating && evaluationError && (
            <p className="evaluation-error">
              AI evaluation is currently unavailable. Your interview was still saved successfully.
            </p>
          )}
        </section>

        {evaluating && (
          <section className="evaluation-loading">
            <Loader2 size={30} />

            <div>
              <h2>
                AI is analyzing your answers
              </h2>

              <p>
                Evaluating your answers for correctness,
                clarity, technical knowledge, and overall
                interview performance.
              </p>
            </div>
          </section>
        )}

        {!evaluating && evaluation && (
          <section className="ai-feedback-section">
            <div className="ai-section-title">
              <Brain size={28} />

              <div>
                <p>AI Evaluation</p>

                <h2>Your AI Interview Report</h2>
              </div>
            </div>

            <div className="ai-score-highlight">
              <span>Overall Score</span>

              <strong>{displayScore}%</strong>
            </div>

            {overallFeedback && (
              <div className="ai-summary-card">
                <h3>Overall Feedback</h3>

                <p>{overallFeedback}</p>
              </div>
            )}

            <div className="feedback-grid">
              <div className="feedback-card strengths-card">
                <div className="feedback-card-title">
                  <ThumbsUp size={21} />

                  <h3>Strengths</h3>
                </div>

                {strengths.length > 0 ? (
                  <ul>
                    {strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    No specific strengths were provided in
                    the evaluation.
                  </p>
                )}
              </div>

              <div className="feedback-card improvements-card">
                <div className="feedback-card-title">
                  <Lightbulb size={21} />

                  <h3>Areas to Improve</h3>
                </div>

                {improvements.length > 0 ? (
                  <ul>
                    {improvements.map(
                      (improvement, index) => (
                        <li key={index}>
                          {improvement}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>
                    No specific improvement suggestions were
                    provided.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="answers-review">
          <h2>Questions & Your Answers</h2>

          {answers.map((item, index) => {
            const answerText =
              typeof item.answer === "string"
                ? item.answer.trim()
                : "";

            const isAnswered = answerText.length > 0;

            const feedback =
              questionFeedback[index] ||
              questionFeedback.find(
                (itemFeedback) =>
                  itemFeedback?.question === item.question
              );

            const feedbackScore =
              typeof feedback?.score === "number"
                ? feedback.score
                : null;

            const feedbackText =
              feedback?.feedback ||
              feedback?.comment ||
              feedback?.evaluation ||
              "";

            return (
              <article
                className="answer-review-card"
                key={index}
              >
                <div className="answer-review-header">
                  <div className="question-status">
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

                    <span className="question-number">
                      Question {index + 1}
                    </span>
                  </div>

                  {feedbackScore !== null && (
                    <span className="question-score">
                      Score: {feedbackScore}%
                    </span>
                  )}
                </div>

                <h3>{item.question}</h3>

                <div className="answer-box">
                  {isAnswered
                    ? answerText
                    : "No answer was provided."}
                </div>

                {feedbackText && (
                  <div className="question-feedback">
                    <h4>AI Feedback</h4>

                    <p>{feedbackText}</p>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        <div className="result-actions">
          <button
            type="button"
            className="result-primary-btn"
            onClick={handleTryAgain}
          >
            <RotateCcw size={18} />
            Try Another Interview
          </button>

          <button
            type="button"
            className="result-secondary-btn"
            onClick={handleDashboard}
          >
            <Home size={18} />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;