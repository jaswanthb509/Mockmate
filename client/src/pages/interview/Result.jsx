import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Trophy,
  Brain,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  LayoutDashboard,
  Lightbulb,
  TrendingUp,
  Clock3,
} from "lucide-react";
import API from "../../services/api";
import "./Result.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hasProcessed = useRef(false);

  const interviewConfig = location.state?.interviewConfig || {};

  const answers = Array.isArray(location.state?.answers)
    ? location.state.answers
    : [];

  const questions = Array.isArray(location.state?.questions)
    ? location.state.questions
    : [];

  const totalQuestions =
    Number(location.state?.totalQuestions) ||
    questions.length ||
    answers.length;

  const normalizedAnswers =
    answers.length > 0
      ? answers.map((item, index) => ({
          question:
            item?.question ||
            questions[index] ||
            `Question ${index + 1}`,
          answer:
            typeof item?.answer === "string"
              ? item.answer
              : "",
        }))
      : questions.map((question, index) => ({
          question:
            typeof question === "string"
              ? question
              : question?.question || `Question ${index + 1}`,
          answer: "",
        }));

  const answeredCount = normalizedAnswers.filter(
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

  const [saving, setSaving] = useState(false);
  const [savedInterview, setSavedInterview] =
    useState(null);

  const [evaluating, setEvaluating] =
    useState(false);

  const [evaluation, setEvaluation] =
    useState(null);

  const [saveError, setSaveError] =
    useState("");

  const [evaluationError, setEvaluationError] =
    useState("");

  useEffect(() => {
    if (
      hasProcessed.current ||
      !location.state ||
      !interviewConfig.role ||
      normalizedAnswers.length === 0
    ) {
      return;
    }

    hasProcessed.current = true;

    const processInterview = async () => {
      let interviewId = null;

      try {
        setSaving(true);
        setSaveError("");

        const saveResponse = await API.post(
          "/interview/save",
          {
            role: interviewConfig.role,
            company:
              interviewConfig.company || "",
            experience:
              interviewConfig.experience || "",
            difficulty:
              interviewConfig.difficulty || "",
            interviewType:
              interviewConfig.interviewType || "",
            techStack:
              interviewConfig.techStack || "",
            totalQuestions,
            answeredQuestions: answeredCount,
            completionScore,
            answers: normalizedAnswers,
          }
        );

        const savedData =
          saveResponse.data?.data ||
          saveResponse.data?.interview ||
          saveResponse.data;

        interviewId =
          savedData?._id ||
          savedData?.id ||
          savedData?.interviewId;

        if (!interviewId) {
          throw new Error(
            "Interview was saved, but no interview ID was returned."
          );
        }

        setSavedInterview(savedData);
      } catch (error) {
        console.error(
          "Interview save error:",
          error
        );

        setSaveError(
          error.response?.data?.message ||
            error.message ||
            "Could not save the interview."
        );

        return;
      } finally {
        setSaving(false);
      }

      try {
        setEvaluating(true);
        setEvaluationError("");

        const evaluationResponse =
          await API.post(
            "/interview/evaluate",
            {
              interviewId,
            }
          );

        const evaluationData =
          evaluationResponse.data?.data ||
          evaluationResponse.data?.evaluation ||
          evaluationResponse.data;

        if (!evaluationData) {
          throw new Error(
            "AI evaluation completed, but no evaluation data was returned."
          );
        }

        setEvaluation(evaluationData);
      } catch (error) {
        console.error(
          "AI evaluation error:",
          error
        );

        setEvaluationError(
          error.response?.data?.message ||
            error.message ||
            "AI evaluation could not be completed. Your interview was still saved successfully."
        );
      } finally {
        setEvaluating(false);
      }
    };

    processInterview();
  }, []);

  if (
    !location.state ||
    !interviewConfig.role ||
    normalizedAnswers.length === 0
  ) {
    return (
      <main className="result-page">
        <div className="result-container empty-result">
          <div className="result-icon">
            <Trophy size={38} />
          </div>

          <h1>No Interview Results Found</h1>

          <p>
            Please complete an interview to view your
            results.
          </p>

          <button
            type="button"
            className="result-primary-btn"
            onClick={() =>
              navigate("/setup-interview")
            }
          >
            Start New Interview
          </button>
        </div>
      </main>
    );
  }

  const aiScore =
    typeof evaluation?.overallScore === "number"
      ? evaluation.overallScore
      : typeof evaluation?.score === "number"
      ? evaluation.score
      : null;

  const displayScore =
    aiScore !== null
      ? aiScore
      : completionScore;

  const overallFeedback =
    evaluation?.overallFeedback ||
    evaluation?.summary ||
    evaluation?.feedback ||
    "";

  const strengths = Array.isArray(
    evaluation?.strengths
  )
    ? evaluation.strengths
    : [];

  const improvements = Array.isArray(
    evaluation?.improvements
  )
    ? evaluation.improvements
    : Array.isArray(
        evaluation?.areasToImprove
      )
    ? evaluation.areasToImprove
    : [];

  const questionFeedbackList = Array.isArray(
    evaluation?.questionFeedback
  )
    ? evaluation.questionFeedback
    : Array.isArray(
        evaluation?.questionEvaluations
      )
    ? evaluation.questionEvaluations
    : [];

  const getQuestionFeedback = (
    question,
    index
  ) => {
    if (
      questionFeedbackList.length === 0
    ) {
      return null;
    }

    return (
      questionFeedbackList[index] ||
      questionFeedbackList.find(
        (item) =>
          item?.question === question
      ) ||
      null
    );
  };

  const handlePracticeAgain = () => {
    navigate("/setup-interview");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <main className="result-page">
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
            {saving
              ? "Saving your completed interview..."
              : evaluating
              ? "Your answers are being analyzed by AI. Please wait a moment."
              : evaluation
              ? "Your AI evaluation report is ready and has been saved to your interview history."
              : savedInterview
              ? "Your interview was completed and saved successfully."
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

          <div
            className={`score-circle ${
              evaluating
                ? "score-circle-evaluating"
                : ""
            }`}
          >
            {evaluating ? (
              <Loader2
                size={48}
                className="score-loader"
              />
            ) : (
              <span>
                {displayScore}%
              </span>
            )}
          </div>

          <h2>
            {answeredCount} / {totalQuestions}{" "}
            Questions Answered
          </h2>

          {saving && (
            <div className="save-status saving-status">
              <Loader2
                size={16}
                className="save-loader"
              />
              <span>
                Saving interview...
              </span>
            </div>
          )}

          {!saving &&
            savedInterview &&
            !saveError && (
              <div className="save-status">
                <CheckCircle2 size={16} />
                <span>
                  Interview saved successfully
                </span>
              </div>
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
              <span>
                Generating your AI evaluation...
              </span>
            </div>
          )}

          {!evaluating &&
            evaluationError && (
              <p className="evaluation-error">
                {evaluationError}
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
                Evaluating correctness,
                relevance, clarity,
                completeness, and
                communication quality.
              </p>
            </div>
          </section>
        )}

        {!evaluating && evaluation && (
          <section className="ai-feedback-section">
            <div className="ai-section-title">
              <Brain size={30} />

              <div>
                <p>AI Evaluation</p>
                <h2>
                  Your AI Interview Report
                </h2>
              </div>
            </div>

            <div className="ai-score-highlight">
              <span>Overall Score</span>
              <strong>
                {displayScore}%
              </strong>
            </div>

            <div className="result-feedback-summary">
              <h3>Overall Feedback</h3>

              <p>
                {overallFeedback ||
                  "Your interview has been evaluated successfully."}
              </p>
            </div>

            <div className="result-feedback-grid">
              <div className="result-feedback-card result-strengths-card">
                <div className="result-feedback-card-title">
                  <TrendingUp size={22} />

                  <h3>Strengths</h3>
                </div>

                {strengths.length > 0 ? (
                  <ul>
                    {strengths.map(
                      (
                        strength,
                        index
                      ) => (
                        <li key={index}>
                          {strength}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>
                    No specific strengths were generated.
                  </p>
                )}
              </div>

              <div className="result-feedback-card result-improvements-card">
                <div className="result-feedback-card-title">
                  <Lightbulb size={22} />

                  <h3>
                    Areas to Improve
                  </h3>
                </div>

                {improvements.length > 0 ? (
                  <ul>
                    {improvements.map(
                      (
                        improvement,
                        index
                      ) => (
                        <li key={index}>
                          {improvement}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>
                    No specific improvement suggestions were generated.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="answers-review">
          <h2>
            Questions & Your Answers
          </h2>

          {normalizedAnswers.map(
            (item, index) => {
              const answerText =
                typeof item.answer === "string"
                  ? item.answer.trim()
                  : "";

              const isAnswered =
                answerText.length > 0;

              const feedback =
                getQuestionFeedback(
                  item.question,
                  index
                );

              const feedbackScore =
                typeof feedback?.score ===
                "number"
                  ? feedback.score
                  : null;

              const feedbackText =
                feedback?.feedback ||
                feedback?.comment ||
                feedback?.evaluation ||
                feedback?.message ||
                "";

              return (
                <article
                  className="answer-review-card"
                  key={index}
                >
                  <div className="answer-review-header">
                    <div className="question-status">
                      <span className="question-number">
                        Question {index + 1}
                      </span>

                      {isAnswered ? (
                        <CheckCircle2
                          size={20}
                          className="answered-icon"
                        />
                      ) : (
                        <AlertCircle
                          size={20}
                          className="unanswered-icon"
                        />
                      )}
                    </div>

                    {feedbackScore !== null && (
                      <span className="question-score">
                        {feedbackScore}/100
                      </span>
                    )}
                  </div>

                  <h3>
                    {item.question}
                  </h3>

                  <div className="answer-label">
                    Your Answer
                  </div>

                  <div className="answer-box">
                    {isAnswered
                      ? answerText
                      : "No answer was provided for this question."}
                  </div>

                  {!evaluating &&
                    evaluation && (
                      <div className="question-feedback">
                        <div className="question-feedback-header">
                          <Brain size={18} />
                          <span>
                            AI Feedback
                          </span>
                        </div>

                        <p>
                          {feedbackText ||
                            "No specific feedback was generated for this answer."}
                        </p>
                      </div>
                    )}
                </article>
              );
            }
          )}

          {normalizedAnswers.length === 0 && (
            <div className="no-answers-card">
              <Clock3 size={24} />

              <div>
                <h3>
                  No question responses available
                </h3>

                <p>
                  No answers were submitted during this interview session.
                </p>
              </div>
            </div>
          )}
        </section>

        <div className="result-actions">
          <button
            type="button"
            className="result-primary-btn"
            onClick={handlePracticeAgain}
          >
            <RotateCcw size={19} />
            Practice Again
          </button>

          <button
            type="button"
            className="result-secondary-btn"
            onClick={handleDashboard}
          >
            <LayoutDashboard size={19} />
            Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
};

export default Result;