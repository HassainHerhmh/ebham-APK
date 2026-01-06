import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg space-y-6">

        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">إبهام</h1>
          <p className="text-gray-500 mt-1">تسجيل الدخول إلى حسابك</p>
        </div>

        {/* Phone Login */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            رقم الجوال
          </label>
          <input
            type="tel"
            placeholder="05xxxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <button
            onClick={() => {
              if (!phone) return alert("أدخل رقم الجوال");
              // لاحقًا: إرسال OTP
              navigate("/complete-profile");
            }}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold"
          >
            إرسال رمز الدخول
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-400 text-sm">أو</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={() => {
            // لاحقًا: Google OAuth
            navigate("/complete-profile");
          }}
          className="w-full border flex items-center justify-center gap-3 py-2 rounded-lg hover:bg-gray-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-700">
            المتابعة باستخدام Google
          </span>
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center">
          بتسجيل الدخول أنت توافق على الشروط وسياسة الخصوصية
        </p>

      </div>
    </div>
  );
};

export default Login;
