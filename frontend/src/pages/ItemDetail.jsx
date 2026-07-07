import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isOwner = item?.userId === user?.id;

  useEffect(() => {
    loadItem();
  }, [id]);

  async function loadItem() {
    try {
      const res = await api.get("/items");
      const found = res.data.find((i) => i.id === parseInt(id));
      if (!found) {
        navigate("/items");
        return;
      }
      setItem(found);
      if (found.userId === user?.id) {
        const claimRes = await api.get(`/items/${id}/claims`);
        setClaims(claimRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitClaim(e) {
    e.preventDefault();
    setError("");
    if (!message) {
      setError("Tulis pesan klaim terlebih dahulu");
      return;
    }
    try {
      await api.post(`/items/${id}/claims`, { message });
      setMessage("");
      alert("Klaim berhasil diajukan!");
    } catch (err) {
      setError(err.response?.data?.error || "Gagal mengajukan klaim");
    }
  }

  async function handleMarkResolved() {
    try {
      await api.patch(`/items/${id}/status`, { status: "resolved" });
      loadItem();
    } catch (err) {
      alert(err.response?.data?.error || "Gagal update status");
    }
  }

  async function handleRespondClaim(claimId, status) {
    try {
      await api.patch(`/claims/${claimId}/respond`, { status });
      loadItem();
    } catch (err) {
      alert(err.response?.data?.error || "Gagal merespon klaim");
    }
  }

  if (loading)
    return (
      <div
        style={{
          fontFamily: "Poppins, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F7F5",
        }}
      >
        <p style={{ color: "#8FA8B8" }}>Memuat...</p>
      </div>
    );

  if (!item) return null;

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
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate("/items")}
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 20,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Kembali
          </button>
          {user && (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
              }}
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 20,
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Keluar
            </button>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}
        >
          {/* KIRI */}
          <div>
            <div
              style={{
                background: "white",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #e5e8eb",
                boxShadow: "0 2px 12px rgba(22,56,74,0.07)",
              }}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: "100%", height: 340, objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    height: 340,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 80,
                    background: "#F0F4F6",
                    color: "#B0BEC5",
                  }}
                >
                  📦
                </div>
              )}
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  <span
                    style={{
                      background: item.type === "lost" ? "#FEF2F2" : "#EFF8F2",
                      color: item.type === "lost" ? "#C44545" : "#2E7D4F",
                      padding: "5px 14px",
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {item.type === "lost"
                      ? "Barang Hilang"
                      : "Barang Ditemukan"}
                  </span>
                  <span
                    style={{
                      background:
                        item.status === "open"
                          ? "#FFF8E8"
                          : item.status === "claimed"
                            ? "#EAF3FB"
                            : "#EFF8F2",
                      color:
                        item.status === "open"
                          ? "#B8842E"
                          : item.status === "claimed"
                            ? "#1D5C8A"
                            : "#2E7D4F",
                      padding: "5px 14px",
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: 14,
                      color: "#5A7080",
                    }}
                  >
                    <span>📍</span>
                    <span>{item.location}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: 14,
                      color: "#5A7080",
                    }}
                  >
                    <span>🏷️</span>
                    <span>Kategori: {item.category}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: 14,
                      color: "#D4A843",
                    }}
                  >
                    <span>🕐</span>
                    <span>
                      {item.type === "lost" ? "Hilang" : "Ditemukan"}:{" "}
                      {new Date(item.date || item.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PELAPOR */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                padding: 20,
                marginTop: 16,
                border: "1px solid #e5e8eb",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#8FA8B8",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 12,
                }}
              >
                Dilaporkan oleh
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "#16384A",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 800,
                    fontSize: 18,
                  }}
                >
                  {item.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div
                    style={{ fontWeight: 700, color: "#16384A", fontSize: 15 }}
                  >
                    {item.user?.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#8FA8B8" }}>
                    Mahasiswa Cakrawala University
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KANAN */}
          <div>
            {/* DETAIL */}
            <div
              style={{
                background: "white",
                borderRadius: 16,
                padding: 24,
                border: "1px solid #e5e8eb",
                marginBottom: 20,
              }}
            >
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#16384A",
                  marginBottom: 16,
                }}
              >
                {item.title}
              </h1>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#8FA8B8",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 8,
                }}
              >
                Deskripsi
              </p>
              <p
                style={{
                  fontSize: 15,
                  color: "#3D4F5A",
                  lineHeight: 1.8,
                  marginBottom: 20,
                }}
              >
                {item.description}
              </p>
              {isOwner && item.status !== "resolved" && (
                <button
                  onClick={handleMarkResolved}
                  style={{
                    background: "#2E7D4F",
                    color: "white",
                    border: "none",
                    borderRadius: 20,
                    padding: "10px 24px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 14,
                    fontFamily: "Poppins, sans-serif",
                    width: "100%",
                  }}
                >
                  Tandai Sudah Selesai
                </button>
              )}
            </div>

            {/* FORM KLAIM */}
            {!isOwner && item.status === "open" && user && (
              <div
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: 24,
                  border: "1px solid #e5e8eb",
                  marginBottom: 20,
                }}
              >
                <h3
                  style={{ fontWeight: 700, color: "#16384A", marginBottom: 6 }}
                >
                  Ajukan Klaim
                </h3>
                <p style={{ fontSize: 13, color: "#8FA8B8", marginBottom: 16 }}>
                  Yakin ini milikmu? Tuliskan ciri-ciri barang secara detail.
                </p>
                {error && (
                  <div
                    style={{
                      background: "#FEF2F2",
                      color: "#C44545",
                      padding: "10px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      marginBottom: 14,
                    }}
                  >
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmitClaim}>
                  <textarea
                    placeholder="Tuliskan ciri-ciri barang secara detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      border: "1.5px solid #d8dde3",
                      borderRadius: 10,
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 14,
                      minHeight: 100,
                      resize: "vertical",
                      marginBottom: 14,
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "#D4A843",
                      color: "#16384A",
                      border: "none",
                      borderRadius: 20,
                      padding: "11px 28px",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                      fontFamily: "Poppins, sans-serif",
                      width: "100%",
                    }}
                  >
                    Kirim Klaim
                  </button>
                </form>
              </div>
            )}

            {/* BELUM LOGIN */}
            {!user && (
              <div
                style={{
                  background: "#16384A",
                  borderRadius: 16,
                  padding: 24,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: 16,
                    fontSize: 14,
                  }}
                >
                  Login untuk mengajukan klaim barang ini
                </p>
                <button
                  onClick={() => navigate("/login")}
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
                  Login Sekarang
                </button>
              </div>
            )}

            {/* DAFTAR KLAIM untuk owner */}
            {isOwner && (
              <div
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: 24,
                  border: "1px solid #e5e8eb",
                }}
              >
                <h3
                  style={{
                    fontWeight: 700,
                    color: "#16384A",
                    marginBottom: 16,
                  }}
                >
                  Klaim Masuk ({claims.length})
                </h3>
                {claims.length === 0 && (
                  <p
                    style={{
                      fontSize: 14,
                      color: "#8FA8B8",
                      fontStyle: "italic",
                    }}
                  >
                    Belum ada klaim masuk.
                  </p>
                )}
                {claims.map((claim) => (
                  <div
                    key={claim.id}
                    style={{
                      background: "#F7F7F5",
                      borderRadius: 10,
                      padding: 16,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#16384A",
                          fontSize: 14,
                        }}
                      >
                        {claim.claimant.name}
                      </div>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 10,
                          background:
                            claim.status === "accepted"
                              ? "#EFF8F2"
                              : claim.status === "rejected"
                                ? "#FEF2F2"
                                : "#FFF8E8",
                          color:
                            claim.status === "accepted"
                              ? "#2E7D4F"
                              : claim.status === "rejected"
                                ? "#C44545"
                                : "#B8842E",
                        }}
                      >
                        {claim.status}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#5A7080",
                        lineHeight: 1.6,
                        marginBottom: 12,
                      }}
                    >
                      {claim.message}
                    </p>
                    {claim.status === "pending" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() =>
                            handleRespondClaim(claim.id, "accepted")
                          }
                          style={{
                            background: "#2E7D4F",
                            color: "white",
                            border: "none",
                            borderRadius: 16,
                            padding: "6px 16px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Terima
                        </button>
                        <button
                          onClick={() =>
                            handleRespondClaim(claim.id, "rejected")
                          }
                          style={{
                            background: "transparent",
                            color: "#C44545",
                            border: "1.5px solid #C44545",
                            borderRadius: 16,
                            padding: "6px 16px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          Tolak
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
