import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const BRAND = "#166534";

export default function CompleteProfile() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    const user = JSON.parse(localStorage.getItem("user")!);

    await api.put(`/users/${user.id}`, {
      phone,
    });

    user.phone = phone;
    localStorage.setItem("user", JSON.stringify(user));

    navigate("/home");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>إكمال البيانات</h2>
        <p style={styles.sub}>نحتاج رقم هاتفك لإكمال التسجيل</p>

        <div style={styles.inputBox}>
          <span style={styles.code}>🇾🇪 +967</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="7xxxxxxxx"
            style={styles.input}
          />
        </div>

        <button style={styles.button} onClick={submit}>
          حفظ والمتابعة
        </button>
      </div>
    </div>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#f0fdf4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#fff",
    padding: "32px",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 15px 40px rgba(0,0,0,.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "22px",
    color: BRAND,
    fontWeight: 700,
  },
  sub: {
    fontSize: "14px",
    marginBottom: "20px",
    color: "#555",
  },
  inputBox: {
    display: "flex",
    border: "1px solid #ddd",
    borderRadius: "14px",
    overflow: "hidden",
    marginBottom: "20px",
  },
  code: {
    padding: "12px",
    background: "#ecfdf5",
    borderLeft: "1px solid #ddd",
  },
  input: {
    flex: 1,
    padding: "12px",
    border: "none",
    outline: "none",
    fontSize: "15px",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: BRAND,
    color: "#fff",
    border: "none",
    borderRadius: "16px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
  },
};
