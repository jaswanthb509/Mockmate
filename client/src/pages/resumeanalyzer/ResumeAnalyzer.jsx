import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Upload,
  X,
  CheckCircle2,
} from "lucide-react";

import "./ResumeAnalyzer.css";

const ResumeAnalyzer = () => {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or DOCX file.");
      setSelectedFile(null);
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or DOCX file.");
      setSelectedFile(null);
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) {
      setError("Please choose a resume before analyzing.");
      return;
    }

    setError("");

    console.log("Resume selected:", selectedFile);

    alert(
      "Resume analysis functionality will be connected next. File selected: " +
        selectedFile.name
    );
  };

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

        <section className="resume-header">
          <p className="resume-label">
            AI-POWERED ANALYSIS
          </p>

          <h1>Resume Analyzer</h1>

          <p>
            Upload your resume and get AI-powered
            insights to improve your skills,
            experience, and job readiness.
          </p>
        </section>

        <section className="resume-upload-card">
          <div className="resume-card-heading">
            <div className="resume-heading-icon">
              <FileText size={27} />
            </div>

            <div>
              <h2>Upload Your Resume</h2>

              <p>
                Upload your resume in PDF or DOCX
                format and MockMate will analyze it
                for you.
              </p>
            </div>
          </div>

          <div
            className="resume-drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="resume-file-input"
              id="resume-file"
            />

            {!selectedFile ? (
              <>
                <div className="resume-upload-icon">
                  <Upload size={28} />
                </div>

                <h3>
                  Drag and drop your resume here
                </h3>

                <p>or</p>

                <label
                  htmlFor="resume-file"
                  className="resume-choose-button"
                >
                  Choose Resume
                </label>

                <span>
                  Supported formats: PDF, DOCX
                </span>
              </>
            ) : (
              <div className="selected-file">
                <div className="selected-file-info">
                  <div className="selected-file-icon">
                    <CheckCircle2 size={24} />
                  </div>

                  <div>
                    <h3>{selectedFile.name}</h3>

                    <p>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      {" · "}
                      Ready to analyze
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="remove-file-button"
                  onClick={removeFile}
                  aria-label="Remove selected file"
                >
                  <X size={19} />
                </button>
              </div>
            )}
          </div>

          {error && (
            <p className="resume-error">
              {error}
            </p>
          )}

          <button
            type="button"
            className="resume-analyze-button"
            onClick={handleAnalyze}
            disabled={!selectedFile}
          >
            <FileText size={18} />
            Analyze Resume
          </button>
        </section>

        <section className="resume-features">
          <div className="resume-feature-card">
            <span>01</span>

            <h3>Resume Score</h3>

            <p>
              Get an overall score based on the
              quality and completeness of your
              resume.
            </p>
          </div>

          <div className="resume-feature-card">
            <span>02</span>

            <h3>Skills Analysis</h3>

            <p>
              Identify your strongest skills and
              discover important skills that may be
              missing.
            </p>
          </div>

          <div className="resume-feature-card">
            <span>03</span>

            <h3>AI Suggestions</h3>

            <p>
              Receive actionable suggestions to
              improve your resume for better job
              opportunities.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ResumeAnalyzer;