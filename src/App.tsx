import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import CompleteProfile from "./pages/auth/CompleteProfile";

/* =========================
   Helpers
========================= */
function getUser() {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

function isLoggedIn() {
  return !!getUser();
}

function isProfileComplete() {
  const user = getUser();
  return user && user.phone;
}

/* =========================
   App
========================= */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* الجذر */}
        <Route
          path="/"
          element={
            !isLoggedIn() ? (
              <Navigate to="/login" replace />
            ) : !isProfileComplete() ? (
              <Navigate to="/complete-profile" replace />
            ) : (
              <Navigate to="/home" replace />
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

        {/* إكمال البيانات */}
        <Route
          path="/complete-profile"
          element={
            !isLoggedIn() ? (
              <Navigate to="/login" replace />
            ) : isProfileComplete() ? (
              <Navigate to="/home" replace />
            ) : (
              <CompleteProfile />
            )
          }
        />

        {/* الصفحة الرئيسية */}
        <Route
          path="/home"
          element={
            !isLoggedIn() ? (
              <Navigate to="/login" replace />
            ) : !isProfileComplete() ? (
              <Navigate to="/complete-profile" replace />
            ) : (
              <div style={{ textAlign: "center", marginTop: "100px" }}>
                <h1>🏠 الصفحة الرئيسية</h1>
                <p>مرحبًا بك في تطبيق إبهام</p>
              </div>
            )
          }
        />

        {/* أي مسار خطأ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
