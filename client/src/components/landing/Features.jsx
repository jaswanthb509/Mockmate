import "./Features.css";
import {
  Upload,
  Clock,
  FileText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const features = [
  {
    icon: <Upload size={35} />,
    title: "Resume Based Interviews",
    description:
      "Upload your resume and practice questions tailored to your skills and experience.",
  },
  {
    icon: <Clock size={35} />,
    title: "Timed Interviews",
    description:
      "Experience realistic interview sessions with time limits similar to real interviews.",
  },
  {
    icon: <FileText size={35} />,
    title: "Detailed Reports",
    description:
      "Get a detailed report showing your performance after every interview.",
  },
  {
    icon: <ShieldCheck size={35} />,
    title: "Secure Authentication",
    description:
      "Your account and interview history are protected with secure authentication.",
  },
  {
    icon: <Sparkles size={35} />,
    title: "AI Recommendations",
    description:
      "Receive personalized suggestions to improve your interview performance.",
  },
  {
    icon: <Users size={35} />,
    title: "Multiple Interview Roles",
    description:
      "Practice Frontend, Backend, Full Stack, HR and other interview types.",
  },
];

const Features = () => {
  return (
    <section className="features" id="features">
      <h2>Powerful Features</h2>

      <p className="features-subtitle">
        Everything you need to prepare for your next interview.
      </p>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;