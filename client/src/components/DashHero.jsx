import "./DashHero.css";

const DashHero = () => {
  return (
    <section className="dashhero">

      <div className="dashhero-left">

        <h1>
          Welcome Back 👋
        </h1>

        <p>
          Ready to improve your interview skills today?
          Start a new AI interview and continue your journey.
        </p>

        <button className="start-interview-btn">
          Start New Interview
        </button>

      </div>

      <div className="dashhero-right">

        <div className="goal-card">

          <h3>Today's Goal</h3>

          <h2>Complete 2 Mock Interviews</h2>

          <p>
            Practice every day to improve your confidence and
            communication skills.
          </p>

        </div>

      </div>

    </section>
  );
};

export default DashHero;