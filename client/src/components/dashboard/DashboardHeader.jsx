import "./DashboardHeader.css";

const DashboardHeader = () => {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-text">
        <h1>Welcome Back</h1>

        <p>Ready to ace your next interview today?</p>
      </div>

      <div className="dashboard-profile">
        <span>J</span>
      </div>
    </header>
  );
};

export default DashboardHeader;