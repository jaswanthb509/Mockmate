import "./Features.css";

const features = [
  {
    icon: "🤖",
    title: "AI Mock Interviews",
    description:
      "Practice realistic AI-generated interview questions tailored to your role.",
  },
  {
    icon: "📊",
    title: "Performance Analytics",
    description:
      "Track your interview performance and monitor your improvement over time.",
  },
  {
    icon: "💬",
    title: "Instant Feedback",
    description:
      "Receive AI-powered feedback on your answers immediately after each interview.",
  },
  {
    icon: "🏢",
    title: "Company Specific",
    description:
      "Prepare for interviews from top companies like Google, Amazon, Microsoft, and more.",
  },
  {
    icon: "📄",
    title: "Resume Based",
    description:
      "Generate interview questions based on your uploaded resume.",
  },
  {
    icon: "📚",
    title: "Interview History",
    description:
      "Review all your previous mock interviews and compare your progress.",
  },
];

const Features = () => {
  return (
    <section className="features" id="features">
      <h2>Powerful Features</h2>

      <p className="subtitle">
        Everything you need to prepare for your dream job.
      </p>

      <div className="feature-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="icon">{feature.icon}</div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;