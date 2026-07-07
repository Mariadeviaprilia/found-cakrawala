import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CATEGORIES = [
  "Semua",
  "Elektronik",
  "Dokumen",
  "Aksesoris",
  "Pakaian",
  "Alat Tulis",
  "Lainnya",
];

function Items() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("lost");
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadItems();
    loadStats();
  }, [filterType, filterStatus]);

  async function loadItems() {
    try {
      const params = {};
      if (filterType) params.type = filterType;
      if (filterStatus) params.status = filterStatus;
      const res = await api.get("/items", { params });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadStats() {
    try {
      const res = await api.get("/items/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("category", category);
      formData.append("type", type);
      if (photoFile) formData.append("photo", photoFile);

      await api.post("/items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setDescription("");
      setLocation("");
      setCategory("");
      setType("lost");
      setPhotoFile(null);
      setShowForm(false);
      loadItems();
      loadStats();
    } catch (err) {
      setError(err.response?.data?.error || "Gagal menambah laporan");
    }
  }

  const filtered = items.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "Semua" || item.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid #d8dde3",
    borderRadius: 8,
    fontFamily: "Poppins, sans-serif",
    fontSize: 14,
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: "#5A7080",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    display: "block",
    marginBottom: 5,
  };

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: "#F7F7F5",
        minHeight: "100vh",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          background: "#16384A",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: 20,
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Found@<span style={{ color: "#D4A843" }}>Cakrawala</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
            Hai, {user?.name}
          </span>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: "#D4A843",
              color: "#16384A",
              border: "none",
              borderRadius: 20,
              padding: "8px 18px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            + Lapor Barang
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 20,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Keluar
          </button>
        </div>
      </nav>

      {/* HERO + SEARCH */}
      <div
        style={{
          background: "linear-gradient(135deg, #16384A, #1e4d66)",
          padding: "50px 32px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: 34,
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          Temukan Yang <span style={{ color: "#D4A843" }}>Hilang</span>
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            marginBottom: 28,
            fontSize: 15,
          }}
        >
          Laporkan atau cari barang hilang di lingkungan Cakrawala University
        </p>
        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 18,
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari laporan kehilangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 20px 14px 46px",
              borderRadius: 30,
              border: "none",
              fontSize: 15,
              fontFamily: "Poppins, sans-serif",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "30px 20px" }}>
        {/* STATS */}
        {stats && (
          <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
            {[
              { number: stats.total, label: "Total Laporan" },
              { number: stats.resolved, label: "Sudah Selesai" },
              { number: stats.total - stats.resolved, label: "Masih Dicari" },
              { number: stats.topCategory || "—", label: "Kategori Terbanyak" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  flex: 1,
                  background: "white",
                  borderRadius: 12,
                  padding: "16px 20px",
                  border: "1px solid #e5e8eb",
                  textAlign: "center",
                }}
              >
                <div
                  style={{ fontSize: 24, fontWeight: 800, color: "#16384A" }}
                >
                  {s.number}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#8FA8B8",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FORM LAPOR */}
        {showForm && (
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: 24,
              marginBottom: 28,
              border: "1px solid #e5e8eb",
              boxShadow: "0 4px 16px rgba(22,56,74,0.08)",
            }}
          >
            <h3 style={{ marginBottom: 18, color: "#16384A", fontWeight: 700 }}>
              Buat Laporan Baru
            </h3>
            {error && (
              <div
                style={{
                  background: "#FEF2F2",
                  color: "#C44545",
                  padding: "10px 14px",
                  borderRadius: 8,
                  marginBottom: 14,
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div>
                  <label style={labelStyle}>Tipe</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="lost">Barang Hilang</option>
                    <option value="found">Barang Ditemukan</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Kategori</label>
                  <input
                    type="text"
                    placeholder="contoh: Elektronik"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Judul</label>
                <input
                  type="text"
                  placeholder="contoh: Dompet Coklat"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Deskripsi Lengkap</label>
                <textarea
                  placeholder="Jelaskan ciri-ciri barang secara detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Lokasi</label>
                <input
                  type="text"
                  placeholder="contoh: Kantin Lt. 2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Foto Barang (opsional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files[0])}
                  style={{ ...inputStyle, padding: "8px 12px" }}
                />
                {photoFile && (
                  <p style={{ fontSize: 12, color: "#2E7D4F", marginTop: 6 }}>
                    ✓ {photoFile.name}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="submit"
                  style={{
                    background: "#D4A843",
                    color: "#16384A",
                    border: "none",
                    borderRadius: 20,
                    padding: "10px 28px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 14,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Submit Laporan
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    background: "transparent",
                    color: "#16384A",
                    border: "1.5px solid #d8dde3",
                    borderRadius: 20,
                    padding: "10px 20px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 14,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FILTER KATEGORI */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? "#16384A" : "white",
                color: activeCategory === cat ? "white" : "#16384A",
                border: "1.5px solid #16384A",
                borderRadius: 20,
                padding: "7px 16px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {cat}
            </button>
          ))}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: "7px 12px",
              border: "1.5px solid #d8dde3",
              borderRadius: 20,
              fontSize: 13,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            <option value="">Semua Tipe</option>
            <option value="lost">Hilang</option>
            <option value="found">Ditemukan</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "7px 12px",
              border: "1.5px solid #d8dde3",
              borderRadius: 20,
              fontSize: 13,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            <option value="">Semua Status</option>
            <option value="open">Open</option>
            <option value="claimed">Claimed</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <p style={{ fontSize: 13, color: "#8FA8B8", marginBottom: 16 }}>
          Menampilkan {filtered.length} laporan
        </p>

        {/* GRID CATALOG */}
        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#8FA8B8",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p>Belum ada laporan yang sesuai.</p>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/items/${item.id}`)}
              style={{
                background: "white",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #e5e8eb",
                boxShadow: "0 2px 12px rgba(22,56,74,0.07)",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(22,56,74,0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 12px rgba(22,56,74,0.07)";
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: 200,
                  background: "#F0F4F6",
                  overflow: "hidden",
                }}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 52,
                      color: "#B0BEC5",
                    }}
                  >
                    📦
                  </div>
                )}
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: item.type === "lost" ? "#C44545" : "#2E7D4F",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {item.category}
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background:
                      item.status === "open"
                        ? "#D4A843"
                        : item.status === "claimed"
                          ? "#1D5C8A"
                          : "#5A7080",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {item.status === "open" ? "available" : item.status}
                </span>
              </div>

              <div
                style={{
                  padding: "16px 16px 14px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#16384A",
                    marginBottom: 6,
                    lineHeight: 1.4,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#5A7080",
                    marginBottom: 12,
                    lineHeight: 1.6,
                    flex: 1,
                  }}
                >
                  {item.description.length > 90
                    ? item.description.slice(0, 90) + "..."
                    : item.description}
                </p>
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      color: "#5A7080",
                      marginBottom: 4,
                    }}
                  >
                    <span>📍</span> {item.location}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      color: "#D4A843",
                    }}
                  >
                    <span>🕐</span>
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    paddingTop: 10,
                    borderTop: "1px solid #f0f0f0",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background: "#16384A",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {item.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#16384A",
                      }}
                    >
                      {item.user?.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#8FA8B8" }}>
                      Pelapor
                    </div>
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      fontSize: 18,
                      color: "#d8dde3",
                    }}
                  >
                    →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Items;
