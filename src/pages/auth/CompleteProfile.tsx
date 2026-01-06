import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    altPhone: "",
    city: "",
    district: "",
    address: "",
  });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center" dir="rtl">
      <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow space-y-6">

        <h2 className="text-2xl font-bold text-gray-800">
          إكمال البيانات
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input" placeholder="الاسم الكامل" />
          <input className="input" placeholder="رقم الجوال" />
          <input className="input" placeholder="رقم تواصل إضافي" />
          <input className="input" placeholder="المدينة" />
          <input className="input" placeholder="الحي" />
        </div>

        <textarea
          className="w-full border rounded-lg p-3"
          placeholder="العنوان الوصفي"
        />

        {/* Map Placeholder */}
        <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
          🗺 سيتم إضافة الخريطة لاحقًا
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
        >
          حفظ والمتابعة
        </button>

      </div>
    </div>
  );
};

export default CompleteProfile;
