import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import CompleteProfile from "../pages/auth/CompleteProfile";
import Dashboard from "../pages/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* default */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
