import { TrendingUp } from "lucide-react";
import "./PerformanceOverview.css";

const PerformanceOverview = () => {
  const scores = [68, 74, 72, 81, 78, 87, 88];

  return (
    <section className="performance-card">
      <div className="performance-header">
        <div>
          <p className="section-label">Performance</p>
          <h2>Performance Overview</h2>
        </div>

        <div className="performance-trend">
          <TrendingUp size={16} />
          <span>+12.4%</span>
        </div>
      </div>

      <div className="performance-summary">
        <strong>88%</strong>
        <span>Average score</span>
      </div>

      <div className="performance-chart">
        {scores.map((score, index) => (
          <div className="chart-column" key={index}>
            <div
              className="chart-bar"
              style={{ height: `${score}%` }}
              title={`${score}%`}
            />

            <span>
              {["M", "T", "W", "T", "F", "S", "S"][index]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PerformanceOverview;