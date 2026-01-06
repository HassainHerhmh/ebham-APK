import api from "./api";

/* =========================
   🔐 Auth Services
========================= */

// 📱 تسجيل الدخول بالهاتف (لاحقًا)
export const loginWithPhone = (phone: string) => {
  return api.post("/auth/login", { phone });
};

// 🔢 التحقق من OTP (لاحقًا)
export const verifyOtp = (phone: string, otp: string) => {
  return api.post("/auth/verify-otp", { phone, otp });
};

// 🔵 تسجيل الدخول عبر Google
export const googleLogin = (token: string) => {
  return api.post("/auth/google", {
    token,
  });
};
