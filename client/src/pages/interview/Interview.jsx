import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mic,
  MicOff,
  Save,
} from "lucide-react";

import "./Interview.css";

const Interview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const interviewConfig = location.state?.interviewConfig;

  const questions = Array.isArray(location.state?.questions)
    ? location.state.questions
    : [];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 10);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!interviewConfig || questions.length === 0) {
      navigate("/setup", { replace: true });
    }
  }, [interviewConfig, questions.length, navigate]);

  useEffect(() => {
    if (!interviewConfig || questions.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interviewConfig, questions.length]);

  if (!interviewConfig || questions.length === 0) {
    return null;
  }

  const currentAnswer = answers[currentQuestion] || "";

  const handleAnswerChange = (e) => {
    const { value } = e.target;

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion]: value,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previousQuestion) => previousQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previousQuestion) => previousQuestion - 1);
    }
  };

  const handleFinishInterview = () => {
    const formattedAnswers = questions.map((question, index) => ({
      question,
      answer: answers[index]?.trim() || "",
    }));

    navigate("/result", {
      state: {
        interviewConfig,
        answers: formattedAnswers,
        totalQuestions: questions.length,
      },
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const answeredCount = Object.values(answers).filter(
    (answer) => typeof answer === "string" && answer.trim().length > 0
  ).length;

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="interview-page">
      <div className="interview-container">
        <header className="interview-header">
          <button
            type="button"
            className="exit-button"
            onClick={() => navigate("/setup")}
          >
            <ArrowLeft size={18} />
            Exit Interview
          </button>

          <div className="interview-timer">
            <Clock3 size={19} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </header>

        <section className="interview-top">
          <div>
            <span className="interview-badge">
              {interviewConfig.interviewType} Interview
            </span>

            <h1>{interviewConfig.role}</h1>

            <p>
              {interviewConfig.experience} •{" "}
              {interviewConfig.difficulty} Difficulty
            </p>

            {interviewConfig.company && (
              <p className="company-name">
                Preparing for: {interviewConfig.company}
              </p>
            )}
          </div>

          <div className="answered-status">
            <CheckCircle2 size={20} />

            <span>
              {answeredCount} of {questions.length} answered
            </span>
          </div>
        </section>

        <div className="progress-wrapper">
          <div className="progress-label">
            <span>
              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </span>

            <span>
              {Math.round(progress)}% Complete
            </span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <main className="question-card">
          <div className="question-number">
            Question {currentQuestion + 1}
          </div>

          <h2>{questions[currentQuestion]}</h2>

          <div className="answer-header">
            <label htmlFor="answer">
              Your Answer
            </label>

            <button
              type="button"
              className={`record-button ${
                isRecording ? "recording" : ""
              }`}
              onClick={() =>
                setIsRecording(
                  (previousState) => !previousState
                )
              }
            >
              {isRecording ? (
                <>
                  <MicOff size={17} />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic size={17} />
                  Record Answer
                </>
              )}
            </button>
          </div>

          <textarea
            id="answer"
            placeholder="Type your answer here..."
            value={currentAnswer}
            onChange={handleAnswerChange}
          />

          <div className="answer-footer">
            <span>
              <Save size={15} />
              Your answer is saved automatically
            </span>

            <span>
              {currentAnswer.length} characters
            </span>
          </div>
        </main>

        <div className="question-navigation">
          <button
            type="button"
            className="navigation-button secondary"
            onClick={goToPreviousQuestion}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft size={18} />
            Previous
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              type="button"
              className="navigation-button finish"
              onClick={handleFinishInterview}
            >
              Finish Interview
              <CheckCircle2 size={18} />
            </button>
          ) : (
            <button
              type="button"
              className="navigation-button primary"
              onClick={goToNextQuestion}
            >
              Next Question
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;