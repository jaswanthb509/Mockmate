import "./WhyMockMate.css";

const data = [
  {
    title: "AI Powered Questions",
    description:
      "Generate interview questions tailored to your target role using Gemini AI.",
    icon: "🤖",
  },
  {
    title: "Detailed Feedback",
    description:
      "Receive instant feedback with strengths, weaknesses and suggestions.",
    icon: "📊",
  },
  {
    title: "Track Progress",
    description:
      "View your interview history and monitor your improvement over time.",
    icon: "📈",
  },
];

const WhyMockMate = () => {
  return (
    <section className="why">
      <h2>Why Choose MockMate?</h2>

      <p className="why-subtitle">
        Everything you need to crack your next interview.
      </p>

      <div className="why-container">
        {data.map((item, index) => (
          <div className="why-card" key={index}>
            <div className="why-icon">{item.icon}</div>

            <h3>{item.title}</h3>

            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyMockMate;