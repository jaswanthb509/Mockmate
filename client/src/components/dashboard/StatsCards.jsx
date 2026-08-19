import {
  Mic,
  Target,
  Trophy,
  CalendarDays,
} from "lucide-react";

import "./StatsCards.css";

const StatsCards = () => {
  const stats = [
    {
      id: 1,
      title: "Total Interviews",
      value: "12",
      icon: Mic,
    },
    {
      id: 2,
      title: "Average Score",
      value: "88%",
      icon: Target,
    },
    {
      id: 3,
      title: "Best Score",
      value: "96%",
      icon: Trophy,
    },
    {
      id: 4,
      title: "This Week",
      value: "5",
      icon: CalendarDays,
    },
  ];

  return (
    <section className="stats-section">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div className="stats-card" key={stat.id}>
            <div className="stats-card-icon">
              <Icon size={26} strokeWidth={2} />
            </div>

            <div className="stats-card-info">
              <p className="stats-card-title">
                {stat.title}
              </p>

              <h2 className="stats-card-value">
                {stat.value}
              </h2>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default StatsCards;