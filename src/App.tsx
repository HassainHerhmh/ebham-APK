import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import CompleteProfile from "./pages/auth/CompleteProfile";

function isLoggedIn() {
  return !!localStorage.getItem("user");
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* الصفحة الرئيسية */}
        <Route
          path="/"
          element={
            isLoggedIn() ? (
              <div style={{ textAlign: "center", marginTop: "100px" }}>
                <h1>🚀 Ebham App</h1>
                <p>تم تشغيل المشروع بنجاح</p>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* تسجيل الدخول */}
        <Route
          path="/login"
          element={
            isLoggedIn() ? <Navigate to="/" replace /> : <Login />
          }
        />

        {/* إكمال الملف */}
        <Route
          path="/complete-profile"
          element={
            isLoggedIn() ? <CompleteProfile /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
