import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import ForgotPasswordRoute from "./routes/ForgotPasswordRoute";
import DashboardLayout from "./pages/DashboardLayout"; // layout contains child routes

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="/signin" element={<Auth tab={0} />} />
      <Route path="/signup" element={<Auth tab={1} />} />
      <Route path="/forgot-password" element={<ForgotPasswordRoute />} />

      {/* 👇 Route with layout and nested children inside DashboardLayout */}
      <Route path="/dashboard/*" element={<DashboardLayout />} />
    </Routes>
  );
}

export default App;
