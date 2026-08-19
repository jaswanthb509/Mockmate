import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import SetupInterview from "./pages/interview/SetupInterview";
import Interview from "./pages/interview/Interview";
import Result from "./pages/interview/Result";
import History from "./pages/history/History";

// Protected Route
import ProtectedRoute from "./routes/ProtectedRoute";

const Protected = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
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
    </Routes>
  );
}

export default App;