import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const BRAND = "#166534";

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
     Fetch Cities
  ========================= */
  useEffect(() => {
    api.cities.getCities().then((res: any) => {
      if (res.success) setCities(res.cities);
    });
  }, []);

  /* =========================
     Fetch Neighborhoods
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
     Location
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
        alert("⚠️ السماح بالموقع إجباري لإكمال التسجيل");
        setLocLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  /* =========================
     Submit
  ========================= */
  const submit = async () => {
    if (!name || !phone || !cityId || !districtId || !locationType) {
      return alert("❌ جميع الحقول مطلوبة");
    }

    if (!latitude || !longitude) {
      return alert("⚠️ يجب تفعيل الموقع");
    }

    const user = JSON.parse(localStorage.getItem("user")!);

    // تحديث بيانات العميل
    await api.put(`/users/${user.id}`, {
      name,
      phone,
      city_id: cityId,
      neighborhood_id: districtId,
      is_profile_complete: 1,
    });

    // إضافة العنوان
    await api.post("/customer-addresses", {
      customer_id: user.id,
      province: Number(cityId),
      district: Number(districtId),
      location_type: locationType,
      latitude,
      longitude,
    });

    user.name = name;
    user.phone = phone;
    user.is_profile_complete = 1;
    localStorage.setItem("user", JSON.stringify(user));

    navigate("/home");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
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
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="7xxxxxxxx"
            style={styles.input}
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
          <input style={styles.coord} value={latitude} readOnly />
          <input style={styles.coord} value={longitude} readOnly />
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
    background: "#fff",
    padding: "28px",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 15px 40px rgba(0,0,0,.1)",
    textAlign: "center",
  },
  title: { fontSize: "22px", color: BRAND, fontWeight: 700 },
  sub: { fontSize: "14px", marginBottom: "16px", color: "#555" },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    marginBottom: "14px",
  },
  inputBox: {
    display: "flex",
    border: "1px solid #ddd",
    borderRadius: "14px",
    overflow: "hidden",
    marginBottom: "14px",
  },
  code: { padding: "12px", background: "#ecfdf5", borderLeft: "1px solid #ddd" },
  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    marginBottom: "14px",
  },
  locBtn: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    marginBottom: "10px",
  },
  coords: { display: "flex", gap: "8px", marginBottom: "16px" },
  coord: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    background: "#f9fafb",
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
  },
};
