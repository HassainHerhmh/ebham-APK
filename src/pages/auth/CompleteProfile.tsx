import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { ArrowRight } from "lucide-react";

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
     Load Cities
  ========================= */
  useEffect(() => {
    api.get("/cities").then((res) => {
      if (res.data.success) {
        setCities(res.data.cities);
      }
    });
  }, []);

  /* =========================
     Load Neighborhoods
  ========================= */
  const loadNeighborhoods = async (cityId: string) => {
    setDistrictId("");
    setNeighborhoods([]);

    if (!cityId) return;

    const res = await api.get("/cities/neighborhoods/search?q=");
    if (res.data.success) {
      setNeighborhoods(
        res.data.neighborhoods.filter(
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
        alert("⚠️ السماح بالموقع إلزامي");
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
      return alert("⚠️ يجب السماح بتحديد الموقع");
    }

    const user = JSON.parse(localStorage.getItem("user")!);

    await api.put(`/customers/${user.id}`, {
      name,
      phone,
      city_id: Number(cityId),
      neighborhood_id: Number(districtId),
      is_profile_complete: 1,
    });

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

  /* =========================
     Back
  ========================= */
  const goBack = () => {
    const ok = window.confirm(
      "هل تريد الرجوع؟ سيتم فقدان البيانات غير المحفوظة"
    );
    if (ok) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Back Button */}
        <button onClick={goBack} style={styles.backBtn}>
          <ArrowRight size={20} />
        </button>

        <h2 style={styles.title}>إكمال البيانات</h2>

        <input
          style={styles.input}
          placeholder="الاسم الكامل"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="رقم الجوال"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

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

        <button onClick={requestLocation} style={styles.locBtn}>
          {locLoading ? "جارٍ تحديد الموقع..." : "📍 السماح بتحديد الموقع"}
        </button>

        <button onClick={submit} style={styles.button}>
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
    direction: "rtl",
  },
  card: {
    position: "relative",
    background: "#fff",
    padding: "28px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 45px rgba(0,0,0,.12)",
  },
  backBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "#f1f5f9",
    border: "none",
    borderRadius: "50%",
    width: 38,
    height: 38,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    color: BRAND,
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    borderRadius: "14px",
    border: "1.5px solid #d1d5db",
    fontSize: 15,
  },
  select: {
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    borderRadius: "14px",
    border: "1.5px solid #d1d5db",
    fontSize: 15,
    background: "#fff",
  },
  locBtn: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    marginBottom: "12px",
    fontWeight: 600,
  },
  button: {
    width: "100%",
    padding: "16px",
    background: BRAND,
    color: "#fff",
    border: "none",
    borderRadius: "16px",
    fontSize: 16,
    fontWeight: 700,
  },
};
