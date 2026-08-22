import { TrendingUp, BarChart3 } from "lucide-react";
import "./PerformanceOverview.css";

const PerformanceOverview = () => {
  const scores = [68, 74, 72, 81, 78, 87, 88];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <section className="performance-card">
      <div className="performance-header">
        <div>
          <div className="performance-title-row">
            <div className="performance-icon">
              <BarChart3 size={18} />
            </div>

            <div>
              <p className="section-label">Your Progress</p>
              <h2>Performance Overview:</h2>
            </div>
          </div>
        </div>

        <div className="performance-trend">
          <TrendingUp size={15} />
          <span>+12.4%</span>
        </div>
      </div>

      <div className="performance-summary">
        <div>
          <strong>88%</strong>
          <span>Average score</span>
        </div>

        <p>Based on your recent interview performance</p>
      </div>

      <div className="performance-chart">
        {scores.map((score, index) => (
          <div className="chart-column" key={index}>
            <div className="chart-bar-wrapper">
              <div
                className="chart-bar"
                style={{ height: `${score}%` }}
                title={`${score}%`}
              />
            </div>

            <span>{days[index]}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PerformanceOverview;