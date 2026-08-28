import "./Features.css";
import {
  BrainCircuit,
  MessageSquareText,
  Building2,
  Mic,
  BarChart3,
  FileUp,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: <BrainCircuit size={28} />,
    title: "AI-Generated Questions",
    description:
      "Practice personalized technical, behavioral, and coding questions tailored to your role, skills, and experience.",
    tag: "Personalized",
  },
  {
    icon: <MessageSquareText size={28} />,
    title: "Instant AI Feedback",
    description:
      "Get detailed feedback on your answers, including technical accuracy, relevance, completeness, and communication.",
    tag: "Smart Evaluation",
  },
  {
    icon: <Building2 size={28} />,
    title: "Company-Specific Practice",
    description:
      "Prepare for your target company with interview questions tailored to specific roles, technologies, and difficulty levels.",
    tag: "Targeted Preparation",
  },
  {
    icon: <Mic size={28} />,
    title: "Voice-Based Interviews",
    description:
      "Practice answering interview questions naturally using speech-to-text for a more realistic interview experience.",
    tag: "Voice Practice",
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Performance Analytics",
    description:
      "Track your scores, identify weak areas, and understand your progress with personalized improvement insights.",
    tag: "Track Progress",
  },
  {
    icon: <FileUp size={28} />,
    title: "Resume-Based Interviews",
    description:
      "Upload your resume and receive interview questions based on your skills, projects, and professional experience.",
    tag: "Resume Awareness",
  },
];

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="features-header">
        <span className="section-label">POWERFUL FEATURES</span>

        <h2>
          Learn from every answer.
          <span> Improve with every interview.</span>
        </h2>

        <p className="features-subtitle">
          From personalized questions to AI-powered feedback, MockMate gives
          you the tools to prepare with confidence.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-top">
              <div className="feature-icon">{feature.icon}</div>

              <span className="feature-tag">{feature.tag}</span>
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>

            <div className="feature-footer">
              <span>Learn more</span>
              <ArrowUpRight size={18} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;