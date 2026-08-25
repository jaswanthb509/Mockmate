import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
} from "lucide-react";

import API from "../../services/api";
import "./PerformanceOverview.css";

const getLastSevenDays = () => {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);

    date.setHours(0, 0, 0, 0);
    date.setDate(today.getDate() - i);

    days.push({
      date,
      key: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
    });
  }

  return days;
};

const getTrendData = (scores) => {
  if (scores.length < 2) {
    return {
      value: "0%",
      type: "neutral",
    };
  }

  const midpoint = Math.ceil(
    scores.length / 2
  );

  const previousScores = scores.slice(
    0,
    midpoint
  );

  const recentScores = scores.slice(
    midpoint
  );

  if (recentScores.length === 0) {
    return {
      value: "0%",
      type: "neutral",
    };
  }

  const previousAverage =
    previousScores.reduce(
      (total, score) => total + score,
      0
    ) / previousScores.length;

  const recentAverage =
    recentScores.reduce(
      (total, score) => total + score,
      0
    ) / recentScores.length;

  const difference = Math.round(
    recentAverage - previousAverage
  );

  if (difference > 0) {
    return {
      value: `+${difference}%`,
      type: "positive",
    };
  }

  if (difference < 0) {
    return {
      value: `${difference}%`,
      type: "negative",
    };
  }

  return {
    value: "0%",
    type: "neutral",
  };
};

const PerformanceOverview = () => {
  const [chartData, setChartData] = useState([]);
  const [averageScore, setAverageScore] =
    useState(0);

  const [trend, setTrend] = useState({
    value: "0%",
    type: "neutral",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await API.get(
          "/interview/history"
        );

        const result = response.data;

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Failed to fetch performance data."
          );
        }

        const interviews = Array.isArray(
          result.data
        )
          ? result.data
          : [];

        const evaluatedInterviews = interviews
          .filter(
            (interview) =>
              interview.evaluation &&
              typeof interview.evaluation
                .overallScore === "number" &&
              interview.createdAt
          )
          .map((interview) => ({
            score: Math.round(
              interview.evaluation.overallScore
            ),
            createdAt: new Date(
              interview.createdAt
            ),
          }))
          .sort(
            (a, b) =>
              a.createdAt.getTime() -
              b.createdAt.getTime()
          );

        if (
          evaluatedInterviews.length === 0
        ) {
          setChartData(
            getLastSevenDays().map((day) => ({
              ...day,
              score: 0,
              count: 0,
            }))
          );

          setAverageScore(0);

          setTrend({
            value: "0%",
            type: "neutral",
          });

          return;
        }

        const overallAverage = Math.round(
          evaluatedInterviews.reduce(
            (total, interview) =>
              total + interview.score,
            0
          ) / evaluatedInterviews.length
        );

        const lastSevenDays =
          getLastSevenDays();

        const performanceData =
          lastSevenDays.map((day) => {
            const interviewsForDay =
              evaluatedInterviews.filter(
                (interview) => {
                  const interviewDate =
                    new Date(
                      interview.createdAt
                    );

                  interviewDate.setHours(
                    0,
                    0,
                    0,
                    0
                  );

                  return (
                    interviewDate
                      .toISOString()
                      .split("T")[0] ===
                    day.key
                  );
                }
              );

            const dayScore =
              interviewsForDay.length > 0
                ? Math.round(
                    interviewsForDay.reduce(
                      (total, interview) =>
                        total +
                        interview.score,
                      0
                    ) /
                      interviewsForDay.length
                  )
                : 0;

            return {
              ...day,
              score: dayScore,
              count: interviewsForDay.length,
            };
          });

        const recentScores =
          evaluatedInterviews
            .slice(-6)
            .map(
              (interview) =>
                interview.score
            );

        setChartData(performanceData);
        setAverageScore(overallAverage);

        setTrend(
          getTrendData(recentScores)
        );
      } catch (error) {
        console.error(
          "Failed to fetch performance overview:",
          error
        );

        setChartData(
          getLastSevenDays().map((day) => ({
            ...day,
            score: 0,
            count: 0,
          }))
        );

        setAverageScore(0);

        setTrend({
          value: "0%",
          type: "neutral",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  const TrendIcon =
    trend.type === "positive"
      ? TrendingUp
      : trend.type === "negative"
      ? TrendingDown
      : Minus;

  const hasPerformance = chartData.some(
    (day) => day.score > 0
  );

  return (
    <section className="performance-card">
      <div className="performance-header">
        <div className="performance-title-row">
          <div className="performance-icon">
            <BarChart3 size={19} />
          </div>

          <div>
            <p className="section-label">
              YOUR PROGRESS
            </p>

            <h2>
              Performance Overview
            </h2>
          </div>
        </div>

        <div
          className={`performance-trend ${trend.type}`}
        >
          <TrendIcon size={15} />

          <span>
            {loading
              ? "..."
              : trend.value}
          </span>
        </div>
      </div>

      <div className="performance-summary">
        <div className="performance-score-info">
          <strong>
            {loading
              ? "..."
              : `${averageScore}%`}
          </strong>

          <span>
            Average score
          </span>
        </div>

        <p>
          {loading
            ? "Loading your performance..."
            : hasPerformance
            ? "Based on your evaluated interviews"
            : "Complete evaluated interviews to see your progress"}
        </p>
      </div>

      <div className="performance-chart">
        {loading ? (
          <div className="performance-empty">
            Loading performance...
          </div>
        ) : (
          chartData.map((day) => (
            <div
              className="chart-column"
              key={day.key}
            >
              <div className="chart-bar-wrapper">
                <div
                  className={`chart-bar ${
                    day.score === 0
                      ? "chart-bar-empty"
                      : ""
                  }`}
                  style={{
                    height:
                      day.score > 0
                        ? `${Math.max(
                            day.score,
                            8
                          )}%`
                        : "4px",
                  }}
                  title={
                    day.count > 0
                      ? `${day.score}% average from ${day.count} interview${
                          day.count > 1
                            ? "s"
                            : ""
                        }`
                      : "No evaluated interviews"
                  }
                >
                  {day.score > 0 && (
                    <span className="chart-score">
                      {day.score}%
                    </span>
                  )}
                </div>
              </div>

              <span className="chart-day">
                {day.label}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default PerformanceOverview;