import { useEffect, useMemo, useState } from "react";
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

const technicalQuestions = [
  "Can you introduce yourself and tell me about your technical background?",
  "Explain the difference between state and props.",
  "What is the difference between SQL and NoSQL databases?",
  "How does authentication using JWT work?",
  "Explain the JavaScript event loop.",
  "What is REST API and how have you used it in your projects?",
  "What is the difference between client-side and server-side rendering?",
  "How do you handle errors in a full-stack application?",
  "Explain how you would optimize the performance of a web application.",
  "Tell me about a challenging technical problem you solved.",
  "What are React Hooks and why are they useful?",
  "How would you design a scalable application?",
  "What is middleware in Express.js?",
  "How do you secure sensitive information in a web application?",
  "Explain the difference between authentication and authorization.",
];

const hrQuestions = [
  "Tell me about yourself.",
  "Why do you want to work in this role?",
  "What are your greatest strengths?",
  "What is one weakness you are currently working on?",
  "Tell me about a challenging situation and how you handled it.",
  "Why should we hire you?",
  "Where do you see yourself in five years?",
  "Tell me about a time you worked successfully in a team.",
  "How do you handle pressure and deadlines?",
  "What motivates you?",
  "Describe a failure and what you learned from it.",
  "How do you handle feedback?",
  "Why are you interested in our company?",
  "Tell me about a project you are proud of.",
  "Do you have any questions for us?",
];

const Interview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const interviewConfig = location.state?.interviewConfig;

  const questions = useMemo(() => {
    if (!interviewConfig) {
      return [];
    }

    const questionCount =
      Number(interviewConfig.numberOfQuestions) || 10;

    if (interviewConfig.interviewType === "HR") {
      return hrQuestions.slice(0, questionCount);
    }

    if (interviewConfig.interviewType === "Mixed") {
      const mixedQuestions = [];

      for (let i = 0; i < questionCount; i++) {
        if (i % 2 === 0) {
          mixedQuestions.push(
            technicalQuestions[
              i % technicalQuestions.length
            ]
          );
        } else {
          mixedQuestions.push(
            hrQuestions[
              i % hrQuestions.length
            ]
          );
        }
      }

      return mixedQuestions;
    }

    return technicalQuestions.slice(0, questionCount);
  }, [interviewConfig]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 10);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!interviewConfig) {
      navigate("/setup", { replace: true });
    }
  }, [interviewConfig, navigate]);

  useEffect(() => {
    if (!interviewConfig) {
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
  }, [interviewConfig]);

  if (!interviewConfig || questions.length === 0) {
    return null;
  }

  const currentAnswer = answers[currentQuestion] || "";

  const handleAnswerChange = (e) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion]: e.target.value,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previousQuestion) =>
        previousQuestion + 1
      );
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((previousQuestion) =>
        previousQuestion - 1
      );
    }
  };

  const handleFinishInterview = () => {
    const formattedAnswers = questions.map(
      (question, index) => ({
        question,
        answer: answers[index]?.trim() || "",
      })
    );

    console.log(
      "FORMATTED INTERVIEW RESULTS:",
      formattedAnswers
    );

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

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const answeredCount = Object.values(answers).filter(
    (answer) => answer.trim().length > 0
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

          <h2>
            {questions[currentQuestion]}
          </h2>

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
            placeholder="Type your answer here. Voice-to-text will be connected next."
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