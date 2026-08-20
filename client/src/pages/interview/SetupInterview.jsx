import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
} from "lucide-react";

import API from "../../services/api";
import "./SetupInterview.css";

const SetupInterview = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    company: "",
    experience: "Fresher",
    difficulty: "Medium",
    interviewType: "Technical",
    numberOfQuestions: 10,
    techStack: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]:
        name === "numberOfQuestions"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.role.trim()) {
      setError("Please enter the job role.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(
        "/interview/generate-questions",
        formData
      );

      const generatedQuestions =
        response.data?.data?.questions;

      if (
        !Array.isArray(generatedQuestions) ||
        generatedQuestions.length === 0
      ) {
        throw new Error("No questions were generated.");
      }

      navigate("/interview", {
        state: {
          interviewConfig: formData,
          questions: generatedQuestions,
        },
      });
    } catch (error) {
      console.error(
        "Failed to generate interview questions:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to generate your interview right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setup-page">
      <div className="setup-card">

        <button
          type="button"
          className="back-dashboard-button"
          onClick={() => navigate("/dashboard")}
          disabled={loading}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="setup-header">
          <div className="setup-icon">
            <Sparkles size={28} />
          </div>

          <div>
            <h1>Setup Your Interview</h1>

            <p>
              Configure your preferences and let AI generate
              personalized interview questions.
            </p>
          </div>
        </div>

        {error && (
          <div className="setup-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="setup-grid">
            <div className="form-group">
              <label>Target Company (Optional)</label>

              <input
                type="text"
                name="company"
                placeholder="Google, Microsoft, Amazon"
                value={formData.company}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Job Role *</label>

              <input
                type="text"
                name="role"
                placeholder="Frontend Developer"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Experience</label>

              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Fresher">Fresher</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3+ Years">3+ Years</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty</label>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label>Interview Type</label>

              <select
                name="interviewType"
                value={formData.interviewType}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Technology Stack</label>

              <input
                type="text"
                name="techStack"
                placeholder="React, Node.js, MongoDB"
                value={formData.techStack}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Number of Questions</label>

              <select
                name="numberOfQuestions"
                value={formData.numberOfQuestions}
                onChange={handleChange}
                disabled={loading}
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="generate-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2
                  size={19}
                  className="button-spinner"
                />
                Generating Questions...
              </>
            ) : (
              <>
                <Sparkles size={19} />
                Generate AI Interview
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default SetupInterview;