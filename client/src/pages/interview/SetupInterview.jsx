import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Building2,
  BriefcaseBusiness,
  Code2,
  BrainCircuit,
  Target,
  ListChecks,
  Check,
} from "lucide-react";

import API from "../../services/api";
import "./SetupInterview.css";

const interviewTypes = [
  {
    value: "Technical",
    title: "Technical",
    description: "DSA, core concepts and technical skills",
    icon: <Code2 size={21} />,
  },
  {
    value: "HR",
    title: "HR / Behavioral",
    description: "Communication and behavioral questions",
    icon: <BrainCircuit size={21} />,
  },
  {
    value: "Mixed",
    title: "Mixed",
    description: "A balanced technical and HR interview",
    icon: <Sparkles size={21} />,
  },
];

const difficultyOptions = ["Easy", "Medium", "Hard"];

const questionOptions = [5, 10, 15];

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

  const updateField = (field, value) => {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.role.trim()) {
      setError("Please enter the job role you are preparing for.");
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
      <div className="setup-background-glow setup-glow-one"></div>
      <div className="setup-background-glow setup-glow-two"></div>

      <div className="setup-container">
        <button
          type="button"
          className="back-dashboard-button"
          onClick={() => navigate("/dashboard")}
          disabled={loading}
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </button>

        <div className="setup-page-header">
          <div className="setup-title-section">
            <div className="setup-icon">
    
            </div>

            <div>
              <span className="setup-eyebrow">
                AI INTERVIEW CONFIGURATION
              </span>

              <h1>Build your mock interview</h1>

              <p>
                Personalize your interview and let MockMate AI
                generate questions based on your role, skills,
                experience, and target company.
              </p>
            </div>
          </div>

          <div className="setup-status-card">
            <div className="setup-status-icon">
              <BrainCircuit size={20} />
            </div>

            <div>
              <span>An AI Interview Engine</span>
              <strong>Ready to generate</strong>
            </div>
          </div>
        </div>

        {error && (
          <div className="setup-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="setup-layout">
            <div className="setup-main-content">

              <section className="setup-section">
                <div className="setup-section-header">
                  <div className="section-icon">
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div>
                    <h2>Interview Details</h2>
                    <p>
                      Tell us what position you are preparing for.
                    </p>
                  </div>
                </div>

                <div className="setup-grid">
                  <div className="form-group form-group-full">
                    <label>Job Role:</label>

                    <input
                      type="text"
                      name="role"
                      placeholder="e.g. Frontend Developer"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label>Target Company:</label>

                    <div className="input-with-icon">
                      <Building2 size={18} />

                      <input
                        type="text"
                        name="company"
                        placeholder="Google, Amazon, Microsoft..."
                        value={formData.company}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>

                    <span className="field-hint">
                      (Optional) — helps to personalize questions.
                    </span>
                  </div>

                  <div className="form-group">
                    <label>Experience Level:</label>

                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="Fresher">
                        Fresher
                      </option>

                      <option value="1 Year">
                        1 Year
                      </option>

                      <option value="2 Years">
                        2 Years
                      </option>

                      <option value="3+ Years">
                        3+ Years
                      </option>
                    </select>
                  </div>

                  <div className="form-group form-group-full">
                    <label>Technology Stack:</label>

                    <div className="input-with-icon">
                      <Code2 size={18} />

                      <input
                        type="text"
                        name="techStack"
                        placeholder="React, Node.js, MongoDB, Java..."
                        value={formData.techStack}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="setup-section">
                <div className="setup-section-header">
                  <div className="section-icon">
                    <BrainCircuit size={19} />
                  </div>

                  <div>
                    <h2>Interview Type</h2>
                    <p>
                      Choose the type of interview you want to practice.
                    </p>
                  </div>
                </div>

                <div className="interview-type-grid">
                  {interviewTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      className={`interview-type-card ${
                        formData.interviewType === type.value
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        updateField(
                          "interviewType",
                          type.value
                        )
                      }
                      disabled={loading}
                    >
                      <div className="interview-type-icon">
                        {type.icon}
                      </div>

                      <div className="interview-type-content">
                        <h3>{type.title}</h3>
                        <p>{type.description}</p>
                      </div>

                      <div className="selection-indicator">
                        {formData.interviewType ===
                          type.value && (
                          <Check size={14} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="setup-section">
                <div className="setup-section-header">
                  <div className="section-icon">
                    <Target size={19} />
                  </div>

                  <div>
                    <h2>Challenge Level</h2>
                    <p>
                      Control how challenging your interview should be.
                    </p>
                  </div>
                </div>

                <div className="option-row">
                  <div>
                    <span className="option-label">
                      Difficulty
                    </span>

                    <p>
                      Choose the complexity of your questions.
                    </p>
                  </div>

                  <div className="segmented-control">
                    {difficultyOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={
                          formData.difficulty === option
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          updateField(
                            "difficulty",
                            option
                          )
                        }
                        disabled={loading}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <aside className="setup-sidebar">
              <div className="interview-summary-card">
                <div className="summary-header">
                  <div className="summary-icon">
                    <ListChecks size={20} />
                  </div>

                  <div>
                    <span>YOUR SESSION</span>
                    <h3>Interview Summary</h3>
                  </div>
                </div>

                <div className="summary-details">
                  <div className="summary-item">
                    <span>Role</span>
                    <strong>
                      {formData.role || "Not selected"}
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>Company</span>
                    <strong>
                      {formData.company || "General practice"}
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>Type</span>
                    <strong>
                      {formData.interviewType}
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>Difficulty</span>
                    <strong>
                      {formData.difficulty}
                    </strong>
                  </div>
                </div>

                <div className="question-selector">
                  <span>Number of Questions</span>

                  <div className="question-options">
                    {questionOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={
                          formData.numberOfQuestions === option
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          updateField(
                            "numberOfQuestions",
                            option
                          )
                        }
                        disabled={loading}
                      >
                        {option}
                      </button>
                    ))}
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

                      Generating...
                    </>
                  ) : (
                    <>
                      
                      Start Your AI Interview
                    </>
                  )}
                </button>

                <p className="generate-note">
                  MockMate AI will generate personalized
                  questions based on your preferences.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupInterview;