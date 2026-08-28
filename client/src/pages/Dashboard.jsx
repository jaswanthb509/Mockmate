import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Sparkles,
  Play,
  BrainCircuit,
  TrendingUp,
} from "lucide-react";

import Sidebar from "../components/dashboard/Sidebar";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import RecentInterviews from "../components/dashboard/RecentInterviews";

import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-container">
          <section className="dashboard-hero">
            <div className="dashboard-hero-glow dashboard-hero-glow-one"></div>
            <div className="dashboard-hero-glow dashboard-hero-glow-two"></div>

            <div className="dashboard-hero-content">
              <div className="dashboard-hero-badge">
                <Sparkles size={15} />
                <span>AN AI-POWERED INTERVIEW PRACTICE PLATFORM</span>
              </div>

              <h2>
                Practice smarter.
                <br />
                <span>Interview with confidence.</span>
              </h2>

              <p>
                Build confidence with personalized AI mock interviews,
                instant feedback, and detailed performance insights designed
                to help you improve faster.
              </p>

              <div className="dashboard-hero-actions">
                <Link to="/setup" className="dashboard-primary-button">
                  <Play size={17} fill="currentColor" />
                  <span>Start Mock Interview</span>
                  <ArrowUpRight size={17} />
                </Link>

                <Link to="/history" className="dashboard-secondary-button">
                  View Interview History
                </Link>
              </div>
            </div>

            <div className="dashboard-hero-visual">
              <div className="hero-orbit hero-orbit-one"></div>
              <div className="hero-orbit hero-orbit-two"></div>

              <div className="hero-ai-card">
                <div className="hero-ai-card-top">
                  <div className="hero-ai-icon">
                    <BrainCircuit size={28} />
                  </div>

                  <div>
                    <span>MockMate AI</span>
                    <p>Ready to practice</p>
                  </div>
                </div>

                <div className="hero-progress">
                  <div className="hero-progress-info">
                    <span>Interview readiness</span>
                    <strong>88%</strong>
                  </div>

                  <div className="hero-progress-track">
                    <div className="hero-progress-bar"></div>
                  </div>
                </div>

                <div className="hero-insight">
                  <TrendingUp size={17} />
                  <span>You're improving consistently</span>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section-heading">
              <div>
                <span className="section-eyebrow">YOUR PROGRESS</span>
                <h2>Performance at a glance</h2>
              </div>

              <p>
                Track your interview activity and improvement over time.
              </p>
            </div>

            <StatsCards />
          </section>

          <section className="dashboard-content-grid">
            <div className="dashboard-panel quick-actions-panel">
              <QuickActions />
            </div>
          </section>

          <section className="dashboard-recent-section">
            <div className="dashboard-section-heading recent-heading">
              <div>
                <span className="section-eyebrow">INTERVIEW ACTIVITY</span>
                <h2>Your recent interviews</h2>
              </div>

              <Link to="/history" className="view-all-link">
                View all
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <RecentInterviews />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;