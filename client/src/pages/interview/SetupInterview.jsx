import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

import "./SetupInterview.css";

const SetupInterview = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    experience: "Fresher",
    difficulty: "Medium",
    interviewType: "Technical",
    numberOfQuestions: 10,
    techStack: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfQuestions" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!formData.role.trim()) {
      setError("Please enter the job role.");
      return;
    }

    if (
      formData.interviewType !== "HR" &&
      !formData.techStack.trim()
    ) {
      setError("Please enter the technology stack.");
      return;
    }

    navigate("/interview", {
      state: {
        interviewConfig: {
          ...formData,
          role: formData.role.trim(),
          techStack: formData.techStack.trim(),
        },
      },
    });
  };

  return (
    <div className="setup-page">
      <div className="setup-container">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="setup-card">
          <div className="setup-heading">
            <div className="setup-icon">
              <Sparkles size={26} />
            </div>

            <div>
              <h1>Setup Your Interview</h1>

              <p>
                Customize your interview and let MockMate prepare your
                personalized practice session.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="setup-form">
            {error && (
              <div className="setup-error">
                {error}
              </div>
            )}

            <div className="form-group full-width">
              <label htmlFor="role">Job Role</label>

              <input
                id="role"
                type="text"
                name="role"
                placeholder="e.g. Frontend Developer"
                value={formData.role}
                onChange={handleChange}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="experience">
                  Experience Level
                </label>

                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  <option>Fresher</option>
                  <option>1 Year</option>
                  <option>2 Years</option>
                  <option>3+ Years</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="difficulty">
                  Difficulty Level
                </label>

                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="interviewType">
                  Interview Type
                </label>

                <select
                  id="interviewType"
                  name="interviewType"
                  value={formData.interviewType}
                  onChange={handleChange}
                >
                  <option>Technical</option>
                  <option>HR</option>
                  <option>Mixed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="numberOfQuestions">
                  Number of Questions
                </label>

                <select
                  id="numberOfQuestions"
                  name="numberOfQuestions"
                  value={formData.numberOfQuestions}
                  onChange={handleChange}
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="techStack">
                Technology Stack
              </label>

              <input
                id="techStack"
                type="text"
                name="techStack"
                placeholder="e.g. React, JavaScript, Node.js, MongoDB"
                value={formData.techStack}
                onChange={handleChange}
              />

              <span className="field-hint">
                Separate technologies with commas. Optional for HR interviews.
              </span>
            </div>

            <button
              type="submit"
              className="generate-button"
            >
              <Sparkles size={19} />
              Generate Interview
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupInterview;