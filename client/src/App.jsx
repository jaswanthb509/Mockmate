import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import SetupInterview from "./pages/interview/SetupInterview";
import Interview from "./pages/interview/Interview";
import Result from "./pages/interview/Result";
import History from "./pages/history/History";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/setup" element={<SetupInterview />} />

      <Route path="/interview" element={<Interview />} />

      <Route path="/result" element={<Result />} />

      <Route path="/history" element={<History />} />
    </Routes>
  );
}

export default App;