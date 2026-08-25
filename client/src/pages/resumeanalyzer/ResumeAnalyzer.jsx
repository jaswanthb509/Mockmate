import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  FileText,
  X,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  Target,
  Sparkles,
  TrendingUp,
  CircleAlert,
} from "lucide-react";

import "./ResumeAnalyzer.css";

const ResumeAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setError("");
    setResult(null);

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);
      setError("Please upload a PDF or DOCX resume.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSelectedFile(null);
      setError("Resume file must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setResult(null);
    setError("");
  };

  const handleAnalyzeResume = async () => {
    if (!selectedFile) {
      setError("Please select a resume before analyzing.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();

      formData.append("resume", selectedFile);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/resume/analyze",
        {
          method: "POST",
          headers: {
            Authorization: token
              ? `Bearer ${token}`
              : "",
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to analyze resume."
        );
      }

      setResult(data.data);
    } catch (err) {
      console.error(
        "Resume analysis failed:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while analyzing your resume."
      );
    } finally {
      setLoading(false);
    }
  };

  const analysis = result?.analysis;

  return (
    <main className="resume-analyzer-page">
      <div className="resume-analyzer-container">
        <Link
          to="/dashboard"
          className="resume-back-button"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <section className="resume-analyzer-header">
          <p className="resume-label">
            AI-POWERED CAREER INSIGHTS
          </p>

          <h1>Resume Analyzer</h1>

          <p>
            Upload your resume and let MockMate analyze
            your profile. Get AI-powered feedback to
            improve your resume and interview readiness.
          </p>
        </section>

        <section className="resume-upload-card">
          <div className="resume-upload-header">
            <div>
              <p className="resume-section-label">
                UPLOAD RESUME
              </p>

              <h2>Choose your resume</h2>

              <p>
                Upload your latest resume in PDF or DOCX
                format.
              </p>
            </div>
          </div>

          {!selectedFile ? (
            <label
              className="resume-drop-zone"
              htmlFor="resume-upload"
            >
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />

              <div className="resume-upload-icon">
                <Upload size={26} />
              </div>

              <h3>Upload your resume</h3>

              <p>
                Click here to choose a PDF or DOCX file
              </p>

              <span>
                Maximum file size: 5 MB
              </span>
            </label>
          ) : (
            <div className="resume-selected-file">
              <div className="resume-file-icon">
                <FileText size={24} />
              </div>

              <div className="resume-file-details">
                <h3>{selectedFile.name}</h3>

                <p>
                  {(
                    selectedFile.size /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </p>
              </div>

              <button
                type="button"
                className="resume-remove-button"
                onClick={handleRemoveFile}
                disabled={loading}
                aria-label="Remove selected resume"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {error && (
            <div className="resume-error-message">
              <AlertCircle size={17} />

              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            className="resume-analyze-button"
            onClick={handleAnalyzeResume}
            disabled={!selectedFile || loading}
          >
            {loading ? (
              <>
                <LoaderCircle
                  size={18}
                  className="resume-loading-icon"
                />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Analyze Resume with AI
              </>
            )}
          </button>
        </section>

        {result && analysis && (
          <section className="resume-result-card">
            <div className="resume-result-header">
              <div className="resume-result-icon">
                <CheckCircle2 size={24} />
              </div>

              <div>
                <p className="resume-section-label">
                  AI ANALYSIS COMPLETE
                </p>

                <h2>Your Resume Insights</h2>

                <p>
                  Personalized feedback generated from
                  your uploaded resume.
                </p>
              </div>
            </div>

            <div className="resume-file-result">
              <span>Analyzed File</span>

              <strong>
                {result.fileName}
              </strong>
            </div>

            <div className="resume-score-grid">
              <div className="resume-score-card">
                <div className="resume-score-icon">
                  <Target size={20} />
                </div>

                <span>Overall Score</span>

                <strong>
                  {analysis.overallScore ?? 0}%
                </strong>
              </div>

              <div className="resume-score-card">
                <div className="resume-score-icon">
                  <TrendingUp size={20} />
                </div>

                <span>Interview Readiness</span>

                <strong>
                  {analysis.interviewReadiness ??
                    "Good"}
                </strong>
              </div>
            </div>

            <div className="resume-analysis-section">
              <div className="resume-analysis-heading">
                <Sparkles size={19} />

                <h3>Overall Summary</h3>
              </div>

              <p className="resume-summary-text">
                {analysis.summary ||
                  "Your resume has been successfully analyzed."}
              </p>
            </div>

            <div className="resume-analysis-grid">
              <div className="resume-analysis-section">
                <div className="resume-analysis-heading">
                  <CheckCircle2 size={19} />

                  <h3>Strengths</h3>
                </div>

                {Array.isArray(
                  analysis.strengths
                ) &&
                analysis.strengths.length > 0 ? (
                  <ul className="resume-feedback-list">
                    {analysis.strengths.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="resume-empty-feedback">
                    No specific strengths were returned.
                  </p>
                )}
              </div>

              <div className="resume-analysis-section">
                <div className="resume-analysis-heading">
                  <CircleAlert size={19} />

                  <h3>Areas to Improve</h3>
                </div>

                {Array.isArray(
                  analysis.improvements
                ) &&
                analysis.improvements.length > 0 ? (
                  <ul className="resume-feedback-list">
                    {analysis.improvements.map(
                      (item, index) => (
                        <li key={index}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="resume-empty-feedback">
                    No specific improvements were returned.
                  </p>
                )}
              </div>
            </div>

            <div className="resume-analysis-section">
              <div className="resume-analysis-heading">
                <TrendingUp size={19} />

                <h3>Recommended Next Steps</h3>
              </div>

              {Array.isArray(
                analysis.recommendations
              ) &&
              analysis.recommendations.length > 0 ? (
                <ul className="resume-feedback-list">
                  {analysis.recommendations.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="resume-empty-feedback">
                  Continue practicing interviews and
                  improving the areas identified above.
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ResumeAnalyzer;