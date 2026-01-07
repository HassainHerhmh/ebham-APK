import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const BRAND = "#166534";

/* =========================
   Interfaces
========================= */
interface City {
  id: number;
  name: string;
}

interface Neighborhood {
  id: number;
  name: string;
  city_id: number;
}

export default function CompleteProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [cities, setCities] = useState<City[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);

  const [cityId, setCityId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [locationType, setLocationType] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locLoading, setLocLoading] = useState(false);

  /* =========================
     Load Cities
  ========================= */
  useEffect(() => {
    api.cities.getCities().then((res: any) => {
      if (res.success) setCities(res.cities);
    });
  }, []);

  /* =========================
     Load Neighborhoods
  ========================= */
  const loadNeighborhoods = async (cityId: string) => {
    setDistrictId("");
    setNeighborhoods([]);

    if (!cityId) return;

    const res = await api.cities.searchNeighborhoods("");
    if (res.success) {
      setNeighborhoods(
        res.neighborhoods.filter(
          (n: Neighborhood) => String(n.city_id) === cityId
        )
      );
    }
  };

  /* =========================
     Request Location
  ========================= */
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("❌ المتصفح لا يدعم تحديد الموقع");
      return;
    }

    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toString());
        setLongitude(pos.coords.longitude.toString());
        setLocLoading(false);
      },
      () => {
        alert("⚠️ السماح بتحديد الموقع ضروري لإكمال التسجيل");
        setLocLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  /* =========================
     Back With Confirm
  ========================= */
  const backToLogin = () => {
    const ok = window.confirm(
      "هل تريد الخروج والعودة إلى صفحة تسجيل الدخول؟"
    );
    if (!ok) return;

    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  /* =========================
     Submit
  ========================= */
  const submit = async () => {
    if (!name || !phone || !cityId || !districtId || !locationType) {
      return alert("❌ جميع الحقول مطلوبة");
    }

    if (!latitude || !longitude) {
      return alert("⚠️ يجب السماح بتحديد الموقع");
    }

    const user = JSON.parse(localStorage.getItem("user")!);

    // تحديث بيانات العميل
    await api.put(`/customers/${user.id}`, {
      name,
      phone,
      city_id: Number(cityId),
      neighborhood_id: Number(districtId),
      is_profile_complete: 1,
    });

    // إضافة عنوان
    await api.post("/customer-addresses", {
      customer_id: user.id,
      province: Number(cityId),
      district: Number(districtId),
      location_type: locationType,
      latitude,
      longitude,
    });

    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, name, phone })
    );

    navigate("/", { replace: true });
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Back Button */}
        <button onClick={backToLogin} style={styles.backBtn}>
          ←
        </button>

        <h2 style={styles.title}>إكمال البيانات</h2>
        <p style={styles.sub}>يرجى إدخال بياناتك لإكمال التسجيل</p>

        {/* Name */}
        <input
          style={styles.input}
          placeholder="الاسم الكامل"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Phone */}
        <div style={styles.inputBox}>
          <span style={styles.code}>🇾🇪 +967</span>
          <input
            style={styles.inputInner}
            placeholder="7xxxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* City */}
        <select
          style={styles.select}
          value={cityId}
          onChange={(e) => {
            setCityId(e.target.value);
            loadNeighborhoods(e.target.value);
          }}
        >
          <option value="">اختر المدينة</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Neighborhood */}
        <select
          style={styles.select}
          value={districtId}
          onChange={(e) => setDistrictId(e.target.value)}
          disabled={!cityId}
        >
          <option value="">اختر الحي</option>
          {neighborhoods.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>

        {/* Location Type */}
        <select
          style={styles.select}
          value={locationType}
          onChange={(e) => setLocationType(e.target.value)}
        >
          <option value="">نوع الموقع</option>
          <option value="منزل">منزل</option>
          <option value="شقة">شقة</option>
          <option value="عمل">عمل</option>
          <option value="فيلا">فيلا</option>
        </select>

        {/* Location */}
        <button style={styles.locBtn} onClick={requestLocation}>
          {locLoading ? "⏳ جارٍ تحديد الموقع..." : "📍 السماح بتحديد الموقع"}
        </button>

        <div style={styles.coords}>
          <input style={styles.coord} value={latitude} readOnly placeholder="Latitude" />
          <input style={styles.coord} value={longitude} readOnly placeholder="Longitude" />
        </div>

        <button style={styles.button} onClick={submit}>
          حفظ والمتابعة
        </button>
      </div>
    </div>
  );
}

/* =========================
   Styles
========================= */
const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#f0fdf4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    position: "relative",
    background: "#fff",
    padding: "28px",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 15px 40px rgba(0,0,0,.1)",
    textAlign: "center",
  },
  backBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "#ecfdf5",
    border: "none",
    borderRadius: "50%",
    width: 40,
    height: 40,
    fontSize: 20,
    cursor: "pointer",
    color: BRAND,
  },
  title: { fontSize: 22, color: BRAND, fontWeight: 700 },
  sub: { fontSize: 14, marginBottom: 14, color: "#555" },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "1px solid #ddd",
    marginBottom: 14,
  },
  inputBox: {
    display: "flex",
    border: "1px solid #ddd",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
  },
  code: { padding: 12, background: "#ecfdf5", borderLeft: "1px solid #ddd" },
  inputInner: { flex: 1, padding: 12, border: "none", outline: "none" },
  select: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "1px solid #ddd",
    marginBottom: 14,
  },
  locBtn: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    marginBottom: 10,
  },
  coords: { display: "flex", gap: 8, marginBottom: 16 },
  coord: {
    flex: 1,
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 12,
    background: "#f9fafb",
  },
  button: {
    width: "100%",
    padding: 14,
    background: BRAND,
    color: "#fff",
    border: "none",
    borderRadius: 16,
    fontSize: 16,
    fontWeight: 600,
  },
};
