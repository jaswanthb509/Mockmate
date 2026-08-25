import { useEffect, useState } from "react";

import {
  Mic,
  Target,
  Trophy,
  CalendarDays,
} from "lucide-react";

import API from "../../services/api";
import "./StatsCards.css";

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    thisWeek: 0,
  });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get(
          "/interview/history"
        );

        const result = response.data;

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Failed to fetch interview statistics."
          );
        }

        const interviews = Array.isArray(
          result.data
        )
          ? result.data
          : [];

        const totalInterviews =
          interviews.length;

        const evaluatedInterviews =
          interviews.filter(
            (interview) =>
              interview.evaluation &&
              typeof interview.evaluation
                .overallScore === "number"
          );

        const averageScore =
          evaluatedInterviews.length > 0
            ? Math.round(
                evaluatedInterviews.reduce(
                  (total, interview) =>
                    total +
                    interview.evaluation
                      .overallScore,
                  0
                ) /
                  evaluatedInterviews.length
              )
            : 0;

        const bestScore =
          evaluatedInterviews.length > 0
            ? Math.round(
                Math.max(
                  ...evaluatedInterviews.map(
                    (interview) =>
                      interview.evaluation
                        .overallScore
                  )
                )
              )
            : 0;

        const now = new Date();

        const startOfWeek =
          new Date(now);

        startOfWeek.setHours(
          0,
          0,
          0,
          0
        );

        startOfWeek.setDate(
          now.getDate() -
            now.getDay()
        );

        const thisWeek =
          interviews.filter(
            (interview) => {
              if (
                !interview.createdAt
              ) {
                return false;
              }

              return (
                new Date(
                  interview.createdAt
                ) >= startOfWeek
              );
            }
          ).length;

        setStats({
          totalInterviews,
          averageScore,
          bestScore,
          thisWeek,
        });
      } catch (error) {
        console.error(
          "Failed to fetch dashboard statistics:",
          error
        );

        setStats({
          totalInterviews: 0,
          averageScore: 0,
          bestScore: 0,
          thisWeek: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      id: 1,
      title: "Total Interviews",
      value: stats.totalInterviews,
      icon: Mic,
    },
    {
      id: 2,
      title: "Average Score",
      value: `${stats.averageScore}%`,
      icon: Target,
    },
    {
      id: 3,
      title: "Best Score",
      value: `${stats.bestScore}%`,
      icon: Trophy,
    },
    {
      id: 4,
      title: "This Week",
      value: stats.thisWeek,
      icon: CalendarDays,
    },
  ];

  return (
    <section className="stats-section">
      {statsData.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            className="stats-card"
            key={stat.id}
          >
            <div className="stats-card-icon">
              <Icon
                size={26}
                strokeWidth={2}
              />
            </div>

            <div className="stats-card-info">
              <p className="stats-card-title">
                {stat.title}
              </p>

              <h2 className="stats-card-value">
                {loading
                  ? "..."
                  : stat.value}
              </h2>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default StatsCards;