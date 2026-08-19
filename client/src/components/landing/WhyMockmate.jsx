import "./WhyMockmate.css";
import {
  BrainCircuit,
  MessageSquareText,
  BarChart3,
  Briefcase,
} from "lucide-react";

const reasons = [
  {
    icon: <BrainCircuit size={40} />,
    title: "AI Generated Questions",
    description:
      "Practice interview questions generated dynamically based on your role and experience.",
  },
  {
    icon: <MessageSquareText size={40} />,
    title: "Instant Feedback",
    description:
      "Receive detailed feedback on your answers to identify strengths and weaknesses.",
  },
  {
    icon: <BarChart3 size={40} />,
    title: "Performance Analytics",
    description:
      "Track your progress with scores, reports, and improvement suggestions.",
  },
  {
    icon: <Briefcase size={40} />,
    title: "Company Specific",
    description:
      "Prepare for interviews from top companies with role-specific questions.",
  },
];

const WhyMockmate = () => {
  return (
    <section className="why-mockmate" id="about">

      <h2>Why Choose MockMate?</h2>

      <p className="why-subtitle">
        Everything you need to crack your dream interview.
      </p>

      <div className="why-grid">

        {reasons.map((item, index) => (
          <div className="why-card" key={index}>

            <div className="why-icon">
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.description}</p>

          </div>
        ))}

      </div>

    </section>
  );
};

export default WhyMockmate;