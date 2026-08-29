import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Dashboard from "./pages/Dashboard";

import SetupInterview from "./pages/interview/SetupInterview";
import Interview from "./pages/interview/Interview";
import Result from "./pages/interview/Result";

import History from "./pages/history/History";
import InterviewDetails from "./pages/history/InterviewDetails";

import Analytics from "./pages/analytics/Analytics";

import ResumeAnalyzer from "./pages/resumeanalyzer/ResumeAnalyzer";
import CareerProfile from "./pages/CareerProfile/CareerProfile";

import ProtectedRoute from "./routes/ProtectedRoute";

const Protected = ({ children }) => {
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />

      <Route
        path="/setup"
        element={
          <Protected>
            <SetupInterview />
          </Protected>
        }
      />

      <Route
        path="/interview"
        element={
          <Protected>
            <Interview />
          </Protected>
        }
      />

      <Route
        path="/result"
        element={
          <Protected>
            <Result />
          </Protected>
        }
      />

      <Route
        path="/history"
        element={
          <Protected>
            <History />
          </Protected>
        }
      />

      <Route
        path="/history/:id"
        element={
          <Protected>
            <InterviewDetails />
          </Protected>
        }
      />

      <Route
        path="/analytics"
        element={
          <Protected>
            <Analytics />
          </Protected>
        }
      />

      <Route
        path="/resume"
        element={
          <Protected>
            <ResumeAnalyzer />
          </Protected>
        }
      />

      <Route
        path="/career-profile"
        element={
          <Protected>
            <CareerProfile />
          </Protected>
        }
      />

      <Route
        path="*"
        element={<Home />}
      />
    </Routes>
  );
}

export default App;