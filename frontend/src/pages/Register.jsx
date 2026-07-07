import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Gagal mendaftar");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #16384A, #1e4d66)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 48,
          color: "white",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          Found@<span style={{ color: "#D4A843" }}>Cakrawala</span>
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
            marginTop: 12,
            fontSize: 14,
          }}
        >
          Bergabung dan bantu sesama civitas akademika
        </p>
      </div>

      {/* RIGHT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F7F5",
          padding: 48,
        }}
      >
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#16384A",
              marginBottom: 6,
            }}
          >
            Buat Akun
          </h2>
          <p style={{ color: "#5A7080", marginBottom: 28, fontSize: 14 }}>
            Daftarkan diri kamu sekarang
          </p>
          {error && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #fca5a5",
                color: "#C44545",
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#5A7080",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              placeholder="Nama kamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                marginBottom: 16,
                marginTop: 6,
                padding: "11px 14px",
                border: "1.5px solid #d8dde3",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "Poppins, sans-serif",
              }}
            />
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#5A7080",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="email@cakrawala.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                marginBottom: 16,
                marginTop: 6,
                padding: "11px 14px",
                border: "1.5px solid #d8dde3",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "Poppins, sans-serif",
              }}
            />
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#5A7080",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                marginBottom: 24,
                marginTop: 6,
                padding: "11px 14px",
                border: "1.5px solid #d8dde3",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "Poppins, sans-serif",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "#D4A843",
                color: "#16384A",
                border: "none",
                borderRadius: 25,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Daftar Sekarang
            </button>
          </form>
          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 14,
              color: "#5A7080",
            }}
          >
            Sudah punya akun?{" "}
            <Link
              to="/login"
              style={{
                color: "#16384A",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Login di sini
            </Link>
          </p>
          <p style={{ textAlign: "center", marginTop: 10 }}>
            <Link
              to="/"
              style={{ color: "#8FA8B8", textDecoration: "none", fontSize: 13 }}
            >
              ← Kembali ke beranda
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
