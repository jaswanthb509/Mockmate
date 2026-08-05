import { useState } from "react";
import "./SetupInterview.css";

const SetupInterview = () => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "Fresher",
    difficulty: "Medium",
    type: "Technical",
    questions: 10,
    techStack: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    // Next step:
    // Send this data to backend
  };

  return (
    <div className="setup-page">

      <div className="setup-card">

        <h1>Setup Your Interview</h1>

        <p>
          Configure your interview preferences before starting.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Job Role</label>

            <input
              type="text"
              name="role"
              placeholder="Frontend Developer"
              value={formData.role}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Experience</label>

            <select
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
            <label>Difficulty</label>

            <select
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
            <label>Interview Type</label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option>Technical</option>
              <option>HR</option>
              <option>Mixed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Number of Questions</label>

            <select
              name="questions"
              value={formData.questions}
              onChange={handleChange}
            >
              <option>5</option>
              <option>10</option>
              <option>15</option>
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
            />
          </div>

          <button type="submit">
            Generate Interview
          </button>

        </form>

      </div>

    </div>
  );
};

export default SetupInterview;