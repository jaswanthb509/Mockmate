import { useEffect, useState } from "react";
import {
  TrendingUp,
  BarChart3,
} from "lucide-react";

import "./PerformanceOverview.css";

const PerformanceOverview = () => {
  const [scores, setScores] = useState([]);
  const [days, setDays] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [trend, setTrend] = useState("0%");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/interview/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to fetch performance data."
          );
        }

        const interviews = Array.isArray(result.data)
          ? result.data
          : [];

        const evaluatedInterviews = interviews
          .filter(
            (interview) =>
              interview.evaluation &&
              typeof interview.evaluation.overallScore ===
                "number" &&
              interview.createdAt
          )
          .sort(
            (a, b) =>
              new Date(a.createdAt) -
              new Date(b.createdAt)
          );

        if (evaluatedInterviews.length === 0) {
          setScores([]);
          setDays([]);
          setAverageScore(0);
          setTrend("0%");
          return;
        }

        const recentInterviews = evaluatedInterviews.slice(-7);

        const performanceScores = recentInterviews.map(
          (interview) =>
            Math.round(
              interview.evaluation.overallScore
            )
        );

        const performanceDays = recentInterviews.map(
          (interview) =>
            new Date(interview.createdAt).toLocaleDateString(
              "en-US",
              {
                weekday: "short",
              }
            )
        );

        const average = Math.round(
          performanceScores.reduce(
            (total, score) => total + score,
            0
          ) / performanceScores.length
        );

        let trendValue = "0%";

        if (performanceScores.length >= 2) {
          const firstScore = performanceScores[0];
          const lastScore =
            performanceScores[
              performanceScores.length - 1
            ];

          if (firstScore > 0) {
            const percentageChange =
              ((lastScore - firstScore) /
                firstScore) *
              100;

            const roundedTrend = Math.abs(
              Math.round(percentageChange)
            );

            trendValue =
              percentageChange >= 0
                ? `+${roundedTrend}%`
                : `-${roundedTrend}%`;
          }
        }

        setScores(performanceScores);
        setDays(performanceDays);
        setAverageScore(average);
        setTrend(trendValue);
      } catch (error) {
        console.error(
          "Failed to fetch performance overview:",
          error
        );

        setScores([]);
        setDays([]);
        setAverageScore(0);
        setTrend("0%");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  return (
    <section className="performance-card">
      <div className="performance-header">
        <div>
          <div className="performance-title-row">
            <div className="performance-icon">
              <BarChart3 size={18} />
            </div>

            <div>
              <p className="section-label">
                Your Progress
              </p>

              <h2>Performance Overview:</h2>
            </div>
          </div>
        </div>

        <div className="performance-trend">
          <TrendingUp size={15} />
          <span>
            {loading ? "..." : trend}
          </span>
        </div>
      </div>

      <div className="performance-summary">
        <div>
          <strong>
            {loading
              ? "..."
              : `${averageScore}%`}
          </strong>

          <span>Average score</span>
        </div>

        <p>
          {scores.length > 0
            ? "Based on your recent interview performance"
            : "Complete interviews to see your performance"}
        </p>
      </div>

      <div className="performance-chart">
        {loading ? (
          <div className="performance-empty">
            Loading performance...
          </div>
        ) : scores.length > 0 ? (
          scores.map((score, index) => (
            <div
              className="chart-column"
              key={`${days[index]}-${index}`}
            >
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar"
                  style={{
                    height: `${Math.max(
                      score,
                      5
                    )}%`,
                  }}
                  title={`${score}%`}
                />
              </div>

              <span>{days[index]}</span>
            </div>
          ))
        ) : (
          <div className="performance-empty">
            No evaluated interviews yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default PerformanceOverview;