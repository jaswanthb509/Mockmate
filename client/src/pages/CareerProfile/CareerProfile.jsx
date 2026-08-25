import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Code2,
  Target,
  Save,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

import "./CareerProfile.css";

const STORAGE_KEY = "mockmateCareerProfile";

const initialProfile = {
  fullName: "",
  targetRole: "",
  targetCompany: "",
  experience: "",
  skills: "",
  careerGoal: "",
};

const CareerProfile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem(STORAGE_KEY);

    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);

        setProfile({
          ...initialProfile,
          ...parsedProfile,
        });
      } catch (error) {
        console.error(
          "Failed to load career profile:",
          error
        );
      }
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(profile)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset your career profile?"
    );

    if (!confirmReset) {
      return;
    }

    setProfile(initialProfile);

    localStorage.removeItem(STORAGE_KEY);

    setSaved(false);
  };

  const completionFields = [
    profile.fullName,
    profile.targetRole,
    profile.targetCompany,
    profile.experience,
    profile.skills,
    profile.careerGoal,
  ];

  const completedFields =
    completionFields.filter(
      (field) => field.trim().length > 0
    ).length;

  const completionPercentage = Math.round(
    (completedFields / completionFields.length) * 100
  );

  return (
    <main className="career-profile-page">
      <div className="career-profile-container">
        <Link
          to="/dashboard"
          className="career-profile-back-button"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <section className="career-profile-header">
          <div>
            <p className="career-profile-label">
              YOUR CAREER PREFERENCES
            </p>

            <h1>Career Profile</h1>

            <p>
              Tell MockMate about your career goals and
              preferences. This helps us make your interview
              preparation more personalized.
            </p>
          </div>

          <div className="career-completion-card">
            <div className="career-completion-top">
              <span>Profile Completion</span>
              <strong>{completionPercentage}%</strong>
            </div>

            <div className="career-progress-track">
              <div
                className="career-progress-fill"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />
            </div>

            <p>
              {completedFields} of{" "}
              {completionFields.length} details completed
            </p>
          </div>
        </section>

        <form
          className="career-profile-form"
          onSubmit={handleSave}
        >
          <section className="career-profile-card">
            <div className="career-card-heading">
              <div className="career-heading-icon">
                <UserRound size={22} />
              </div>

              <div>
                <p className="career-section-label">
                  PERSONAL DETAILS
                </p>

                <h2>Tell us about yourself</h2>

                <p>
                  Basic information for your personalized
                  MockMate experience.
                </p>
              </div>
            </div>

            <div className="career-form-grid">
              <div className="career-field career-field-full">
                <label htmlFor="fullName">
                  Full Name
                </label>

                <div className="career-input-wrapper">
                  <UserRound size={18} />

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={profile.fullName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="career-profile-card">
            <div className="career-card-heading">
              <div className="career-heading-icon">
                <BriefcaseBusiness size={22} />
              </div>

              <div>
                <p className="career-section-label">
                  CAREER TARGET
                </p>

                <h2>Where do you want to go?</h2>

                <p>
                  Set your preferred role, company, and
                  experience level.
                </p>
              </div>
            </div>

            <div className="career-form-grid">
              <div className="career-field">
                <label htmlFor="targetRole">
                  Target Role
                </label>

                <div className="career-input-wrapper">
                  <BriefcaseBusiness size={18} />

                  <input
                    id="targetRole"
                    name="targetRole"
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={profile.targetRole}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="career-field">
                <label htmlFor="targetCompany">
                  Target Company
                </label>

                <div className="career-input-wrapper">
                  <Building2 size={18} />

                  <input
                    id="targetCompany"
                    name="targetCompany"
                    type="text"
                    placeholder="e.g. Google, Microsoft"
                    value={profile.targetCompany}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="career-field career-field-full">
                <label htmlFor="experience">
                  Experience Level
                </label>

                <div className="career-input-wrapper">
                  <GraduationCap size={18} />

                  <select
                    id="experience"
                    name="experience"
                    value={profile.experience}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select your experience level
                    </option>

                    <option value="Fresher">
                      Fresher
                    </option>

                    <option value="0-1 Years">
                      0-1 Years
                    </option>

                    <option value="1-3 Years">
                      1-3 Years
                    </option>

                    <option value="3-5 Years">
                      3-5 Years
                    </option>

                    <option value="5+ Years">
                      5+ Years
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="career-profile-card">
            <div className="career-card-heading">
              <div className="career-heading-icon">
                <Code2 size={22} />
              </div>

              <div>
                <p className="career-section-label">
                  SKILLS & GOALS
                </p>

                <h2>Build your career direction</h2>

                <p>
                  Share your current skills and what you want
                  to achieve.
                </p>
              </div>
            </div>

            <div className="career-form-grid">
              <div className="career-field career-field-full">
                <label htmlFor="skills">
                  Skills & Technology Stack
                </label>

                <div className="career-input-wrapper career-textarea-wrapper">
                  <Code2 size={18} />

                  <textarea
                    id="skills"
                    name="skills"
                    placeholder="e.g. React, JavaScript, Node.js, MongoDB, Python"
                    value={profile.skills}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>

                <span className="career-field-help">
                  Separate your skills with commas.
                </span>
              </div>

              <div className="career-field career-field-full">
                <label htmlFor="careerGoal">
                  Career Goal
                </label>

                <div className="career-input-wrapper career-textarea-wrapper">
                  <Target size={18} />

                  <textarea
                    id="careerGoal"
                    name="careerGoal"
                    placeholder="Describe the role or career milestone you want to achieve..."
                    value={profile.careerGoal}
                    onChange={handleChange}
                    rows="5"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="career-profile-actions">
            <button
              type="button"
              className="career-reset-button"
              onClick={handleReset}
            >
              <RotateCcw size={18} />
              Reset Profile
            </button>

            <button
              type="submit"
              className="career-save-button"
            >
              {saved ? (
                <>
                  <CheckCircle2 size={18} />
                  Profile Saved
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Career Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CareerProfile;