import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Trophy,
  Target,
  TrendingUp,
  FileText,
} from "lucide-react";

import "./Analytics.css";

const getScoreClass = (score) => {
  if (score >= 80) return "analytics-score-excellent";
  if (score >= 60) return "analytics-score-good";
  return "analytics-score-needs-work";
};

const Analytics = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/interview/history",
          {
            headers: {
              Authorization: token
                ? `Bearer ${token}`
                : "",
            },
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to fetch analytics."
          );
        }

        setInterviews(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to fetch analytics:",
          error
        );

        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const analytics = useMemo(() => {
    const evaluatedInterviews = interviews
      .filter(
        (interview) =>
          interview.evaluation &&
          typeof interview.evaluation.overallScore ===
            "number"
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt)
      );

    if (evaluatedInterviews.length === 0) {
      return {
        total: 0,
        average: 0,
        best: 0,
        trend: 0,
        recentScores: [],
      };
    }

    const scores = evaluatedInterviews.map(
      (interview) =>
        Math.round(
          interview.evaluation.overallScore
        )
    );

    const total = scores.length;

    const average = Math.round(
      scores.reduce(
        (sum, score) => sum + score,
        0
      ) / total
    );

    const best = Math.max(...scores);

    let trend = 0;

    if (scores.length >= 2 && scores[0] > 0) {
      trend = Math.round(
        ((scores[scores.length - 1] - scores[0]) /
          scores[0]) *
          100
      );
    }

    return {
      total,
      average,
      best,
      trend,
      recentScores: evaluatedInterviews.slice(-7),
    };
  }, [interviews]);

  return (
    <main className="analytics-page">
      <div className="analytics-container">
        <div className="analytics-header">
          <div>
            <Link
              to="/dashboard"
              className="analytics-back-button"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <p className="analytics-label">
              PERFORMANCE INSIGHTS
            </p>

            <h1>Interview Analytics</h1>

            <p className="analytics-description">
              Track your progress and understand
              how your interview performance is
              improving over time.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="analytics-state">
            Loading analytics...
          </div>
        ) : analytics.total === 0 ? (
          <div className="analytics-empty">
            <div className="analytics-empty-icon">
              <FileText size={28} />
            </div>

            <h2>No analytics yet</h2>

            <p>
              Complete an interview to start
              seeing your performance insights.
            </p>

            <Link
              to="/setup"
              className="analytics-start-button"
            >
              Start an Interview
            </Link>
          </div>
        ) : (
          <>
            <section className="analytics-stats">
              <div className="analytics-stat-card">
                <div className="analytics-stat-icon">
                  <BarChart3 size={22} />
                </div>

                <div>
                  <span>Evaluated Interviews</span>
                  <strong>{analytics.total}</strong>
                </div>
              </div>

              <div className="analytics-stat-card">
                <div className="analytics-stat-icon">
                  <Target size={22} />
                </div>

                <div>
                  <span>Average Score</span>
                  <strong>
                    {analytics.average}%
                  </strong>
                </div>
              </div>

              <div className="analytics-stat-card">
                <div className="analytics-stat-icon">
                  <Trophy size={22} />
                </div>

                <div>
                  <span>Best Score</span>
                  <strong>
                    {analytics.best}%
                  </strong>
                </div>
              </div>

              <div className="analytics-stat-card">
                <div className="analytics-stat-icon">
                  <TrendingUp size={22} />
                </div>

                <div>
                  <span>Overall Trend</span>
                  <strong>
                    {analytics.trend >= 0
                      ? `+${analytics.trend}%`
                      : `${analytics.trend}%`}
                  </strong>
                </div>
              </div>
            </section>

            <section className="analytics-chart-card">
              <div className="analytics-chart-header">
                <div>
                  <p className="analytics-label">
                    SCORE HISTORY
                  </p>

                  <h2>
                    Recent Performance
                  </h2>
                </div>

                <span>
                  Last{" "}
                  {
                    analytics.recentScores
                      .length
                  }{" "}
                  interviews
                </span>
              </div>

              <div className="analytics-chart">
                {analytics.recentScores.map(
                  (interview, index) => {
                    const score = Math.round(
                      interview.evaluation
                        .overallScore
                    );

                    return (
                      <div
                        className="analytics-chart-column"
                        key={
                          interview._id ||
                          index
                        }
                      >
                        <div className="analytics-bar-area">
                          <span className="analytics-score-tooltip">
                            {score}%
                          </span>

                          <div
                            className={`analytics-bar ${getScoreClass(
                              score
                            )}`}
                            style={{
                              height: `${Math.max(
                                score,
                                8
                              )}%`,
                            }}
                          />
                        </div>

                        <span className="analytics-chart-label">
                          {index + 1}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </section>

            <section className="analytics-insights">
              <div className="analytics-insight-card">
                <TrendingUp size={20} />

                <div>
                  <h3>
                    Your Current Average
                  </h3>

                  <p>
                    Your average interview score is{" "}
                    <strong>
                      {analytics.average}%
                    </strong>
                    .
                  </p>
                </div>
              </div>

              <div className="analytics-insight-card">
                <Trophy size={20} />

                <div>
                  <h3>
                    Your Best Performance
                  </h3>

                  <p>
                    Your highest recorded score is{" "}
                    <strong>
                      {analytics.best}%
                    </strong>
                    .
                  </p>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default Analytics;