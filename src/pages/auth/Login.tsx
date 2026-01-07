import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const BRAND_COLOR = "#16a34a";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* =========================
     Google Login Handler
  ========================= */
  const handleGoogleLogin = async (credential: string) => {
    try {
      setLoading(true);

      const res = await api.post("/auth/google", {
        token: credential,
      });

      if (!res.data.success) {
        alert("فشل تسجيل الدخول عبر Google");
        return;
      }

     const { customer, needProfile } = res.data;

localStorage.setItem("user", JSON.stringify(customer));

if (needProfile) {
  navigate("/complete-profile", { replace: true });
} else {
  navigate("/home", { replace: true });
}


    } catch (err) {
      console.error("Google Login Error:", err);
      alert("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.appName}>إبهام</h1>
        <p style={styles.appDesc}>تطبيق توصيل الطلبات وكل شيء</p>
      </div>

      {/* Card */}
      <div style={styles.card}>
        <div style={styles.iconCircle}>📱</div>

        <h2 style={styles.title}>تسجيل الدخول</h2>
        <p style={styles.subtitle}>
          يمكنك تسجيل الدخول برقم الهاتف أو Google
        </p>

        {/* Phone Input (قريبًا OTP) */}
        <div style={styles.phoneBox}>
          <span style={styles.country}>🇾🇪 +967</span>
          <input
            type="tel"
            placeholder="7xxxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
        </div>

        <button style={styles.sendButton} disabled>
          إرسال
        </button>

        <button style={styles.helpButton}>
          الحصول على مساعدة من خدمة العملاء
        </button>

        {/* Google Login */}
        <div style={{ marginTop: "14px" }}>
          <GoogleLogin
            onSuccess={(res) =>
              handleGoogleLogin(res.credential!)
            }
            onError={() =>
              alert("فشل تسجيل الدخول عبر Google")
            }
            width="100%"
          />
        </div>

        {loading && (
          <p style={{ marginTop: 10, fontSize: 13, color: "#666" }}>
            جارٍ تسجيل الدخول...
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================
   Styles
========================= */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f5f5f5",
    direction: "rtl",
    fontFamily: "system-ui",
  },
  header: {
    background: BRAND_COLOR,
    color: "#fff",
    padding: "40px 20px 60px",
    borderBottomLeftRadius: "30px",
    borderBottomRightRadius: "30px",
  },
  appName: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
  },
  appDesc: {
    marginTop: "8px",
    fontSize: "14px",
    opacity: 0.9,
  },
  card: {
    background: "#fff",
    margin: "-40px auto 0",
    borderRadius: "24px",
    padding: "24px",
    maxWidth: "420px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  iconCircle: {
    width: "90px",
    height: "90px",
    margin: "0 auto 16px",
    borderRadius: "50%",
    background: "#e7f6ec",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
  },
  title: {
    margin: "8px 0",
    fontSize: "20px",
    fontWeight: 700,
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  phoneBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "16px",
  },
  country: {
    padding: "12px",
    background: "#f9f9f9",
    borderLeft: "1px solid #ddd",
    fontSize: "14px",
  },
  input: {
    flex: 1,
    padding: "12px",
    border: "none",
    outline: "none",
    fontSize: "15px",
  },
  sendButton: {
    width: "100%",
    padding: "14px",
    background: BRAND_COLOR,
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "not-allowed",
    marginBottom: "12px",
    opacity: 0.7,
  },
  helpButton: {
    width: "100%",
    padding: "12px",
    background: "#fff",
    color: BRAND_COLOR,
    border: `1px solid ${BRAND_COLOR}`,
    borderRadius: "14px",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "12px",
  },
};
