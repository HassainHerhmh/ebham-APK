import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* صفحة تسجيل الدخول */}
        <Route path="/login" element={<Login />} />

        {/* الصفحة الرئيسية (مؤقتًا) */}
        <Route
          path="/"
          element={
            <div style={{ textAlign: "center", marginTop: "100px" }}>
              <h1>Ebham App 🚀</h1>
              <p>تم تشغيل المشروع بنجاح</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
