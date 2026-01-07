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
    api.get("/cities").then((res) => {
      if (res.data.success) {
        setCities(res.data.cities);
      }
    });
  }, []);

  /* =========================
     Fetch Neighborhoods
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

  return (
    <div style={styles.page}>
      <div style={styles.card}>
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
          style={styles.input}
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
          style={styles.input}
          value={districtId}
          onChange={(e) => setDistrictId(e.target.value)}
        >
          <option value="">اختر الحي</option>
          {neighborhoods.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>

        <select
          style={styles.input}
          value={locationType}
          onChange={(e) => setLocationType(e.target.value)}
        >
          <option value="">نوع الموقع</option>
          <option value="منزل">منزل</option>
          <option value="شقة">شقة</option>
          <option value="عمل">عمل</option>
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

const styles: any = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0fdf4",
  },
  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "100%",
    maxWidth: 420,
  },
  title: {
    color: BRAND,
    fontSize: 20,
    marginBottom: 12,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
  },
  locBtn: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    marginBottom: 12,
  },
  button: {
    width: "100%",
    padding: 14,
    background: BRAND,
    color: "#fff",
    border: "none",
    borderRadius: 12,
  },
};
