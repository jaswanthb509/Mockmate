import "./Stats.css";

const stats = [
  {
    number: "10K+",
    title: "Mock Interviews",
  },
  {
    number: "95%",
    title: "Success Rate",
  },
  {
    number: "50+",
    title: "Job Roles",
  },
  {
    number: "24/7",
    title: "AI Available",
  },
];

const Stats = () => {
  return (
    <section className="stats">

      <div className="stats-container">

        {stats.map((item, index) => (
          <div className="stat-card" key={index}>

            <h2>{item.number}</h2>

            <p>{item.title}</p>

          </div>
        ))}

      </div>
    </section>
  );
};

export default Stats;