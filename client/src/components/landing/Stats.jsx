import "./Stats.css";
import { Users, Trophy, Briefcase, Star } from "lucide-react";

const stats = [
  {
    icon: <Users size={40} />,
    number: "15K+",
    title: "Students Trained",
  },
  {
    icon: <Trophy size={40} />,
    number: "95%",
    title: "Success Rate",
  },
  {
    icon: <Briefcase size={40} />,
    number: "500+",
    title: "Companies Covered",
  },
  {
    icon: <Star size={40} />,
    number: "4.9/5",
    title: "User Rating",
  },
];

const Stats = () => {
  return (
    <section className="stats" id="stats">

      <h2>Trusted by Future Professionals</h2>

      <p className="stats-subtitle">
        Thousands of learners use MockMate to prepare for technical interviews.
      </p>

      <div className="stats-grid">

        {stats.map((item, index) => (
          <div className="stats-box" key={index}>

            <div className="stats-icon">
              {item.icon}
            </div>

            <h3>{item.number}</h3>

            <p>{item.title}</p>

          </div>
        ))}

      </div>

    </section>
  );
};

export default Stats;