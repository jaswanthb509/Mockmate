import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import PerformanceOverview from "../components/dashboard/PerformanceOverview";
import RecentInterviews from "../components/dashboard/RecentInterviews";

import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <DashboardHeader />

        <section className="dashboard-hero">
          <div>
            <span className="dashboard-hero-label">
              AI-Powered Interview Practice
            </span>

            <h2>Ready for your next interview?</h2>

            <p>
              Practice with personalized mock interviews and get instant
              feedback on your performance.
            </p>
          </div>

          <a href="/setup" className="dashboard-hero-button">
            Start New Interview
            <span>→</span>
          </a>
        </section>

        <StatsCards />

        <div className="dashboard-content-grid">
          <PerformanceOverview />
          <QuickActions />
        </div>

        <RecentInterviews />
      </main>
    </div>
  );
};

export default Dashboard;