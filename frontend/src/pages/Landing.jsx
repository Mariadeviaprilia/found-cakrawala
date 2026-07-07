import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeIn = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(30px)",
    transition: "opacity 0.8s ease, transform 0.8s ease",
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#F7F7F5" }}>
      {/* NAVBAR */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? "white" : "transparent",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
          padding: "18px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              background: "#16384A",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#D4A843", fontWeight: 900, fontSize: 20 }}>
              F
            </span>
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: 18,
              color: scrolled ? "#16384A" : "white",
            }}
          >
            Found@<span style={{ color: "#D4A843" }}>Cakrawala</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => navigate("/items")}
            style={{
              background: "transparent",
              color: scrolled ? "#16384A" : "white",
              border: `1.5px solid ${scrolled ? "#16384A" : "rgba(255,255,255,0.5)"}`,
              borderRadius: 20,
              padding: "8px 20px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Lihat Laporan
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "transparent",
              color: scrolled ? "#16384A" : "white",
              border: `1.5px solid ${scrolled ? "#16384A" : "rgba(255,255,255,0.5)"}`,
              borderRadius: 20,
              padding: "8px 20px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Masuk
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "#D4A843",
              color: "#16384A",
              border: "none",
              borderRadius: 20,
              padding: "8px 20px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Daftar
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #0F2535 0%, #16384A 50%, #1e4d66 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 48px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: 750 }}>
          <div
            style={{
              ...fadeIn,
              transitionDelay: "0.1s",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(212,168,67,0.12)",
              border: "1px solid rgba(212,168,67,0.3)",
              borderRadius: 20,
              padding: "8px 18px",
              fontSize: 13,
              color: "#D4A843",
              fontWeight: 600,
              marginBottom: 28,
              letterSpacing: 0.3,
            }}
          >
            Platform resmi Cakrawala University
          </div>

          <h1
            style={{
              ...fadeIn,
              transitionDelay: "0.2s",
              fontSize: 58,
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              marginBottom: 22,
            }}
          >
            Bersama, Kita
            <br />
            <span style={{ color: "#D4A843" }}>Temukan Kembali</span>
          </h1>

          <p
            style={{
              ...fadeIn,
              transitionDelay: "0.3s",
              fontSize: 18,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              marginBottom: 44,
              maxWidth: 580,
              margin: "0 auto 44px",
            }}
          >
            Found@Cakrawala menghubungkan pemilik dan penemu barang di
            lingkungan kampus secara mudah, cepat, dan terpercaya.
          </p>

          <div
            style={{
              ...fadeIn,
              transitionDelay: "0.4s",
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/register")}
              style={{
                background: "#D4A843",
                color: "#16384A",
                border: "none",
                borderRadius: 30,
                padding: "16px 36px",
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
                fontFamily: "Poppins, sans-serif",
                boxShadow: "0 8px 24px rgba(212,168,67,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 12px 32px rgba(212,168,67,0.45)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 8px 24px rgba(212,168,67,0.35)";
              }}
            >
              Mulai Sekarang →
            </button>
            <button
              onClick={() => navigate("/items")}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "white",
                border: "1.5px solid rgba(255,255,255,0.25)",
                borderRadius: 30,
                padding: "16px 36px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                fontFamily: "Poppins, sans-serif",
                backdropFilter: "blur(10px)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.15)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.08)")
              }
            >
              Lihat Laporan
            </button>
          </div>

          {/* Scroll indicator */}
          <div
            style={{
              ...fadeIn,
              transitionDelay: "0.8s",
              marginTop: 70,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              color: "rgba(255,255,255,0.3)",
              fontSize: 12,
              letterSpacing: 1,
            }}
          >
            <span>SCROLL</span>
            <div
              style={{
                width: 1,
                height: 40,
                background: "rgba(255,255,255,0.2)",
                animation: "pulse 2s infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ background: "#D4A843", padding: "32px 48px" }}>
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          {[
            { number: "100+", label: "Laporan Masuk" },
            { number: "85%", label: "Barang Kembali" },
            { number: "500+", label: "Mahasiswa Terbantu" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#16384A" }}>
                {s.number}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#16384A",
                  fontWeight: 600,
                  opacity: 0.75,
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FITUR */}
      <div style={{ padding: "90px 48px", background: "#F7F7F5" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(22,56,74,0.06)",
                borderRadius: 20,
                padding: "6px 16px",
                fontSize: 12,
                fontWeight: 700,
                color: "#16384A",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 16,
              }}
            >
              Fitur Utama
            </div>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#16384A",
                marginBottom: 12,
              }}
            >
              Kenapa Found@Cakrawala?
            </h2>
            <p
              style={{
                color: "#5A7080",
                fontSize: 16,
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              Dirancang khusus untuk civitas akademika Cakrawala University
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                icon: "📋",
                title: "Lapor Mudah",
                desc: "Buat laporan dalam hitungan detik dengan form yang intuitif dan mendukung foto bukti.",
              },
              {
                icon: "🔍",
                title: "Cari Cepat",
                desc: "Filter berdasarkan kategori, lokasi, tipe, dan status untuk menemukan barang lebih mudah.",
              },
              {
                icon: "🤝",
                title: "Klaim Terstruktur",
                desc: "Sistem klaim dengan pesan personal memastikan barang kembali ke pemilik yang tepat.",
              },
              {
                icon: "📊",
                title: "Pantau Real-time",
                desc: "Lacak status laporanmu dari open, claimed, hingga resolved secara transparan.",
              },
            ].map((f, i) => (
              <div
                key={f.title}
                style={{
                  background: "white",
                  padding: 28,
                  borderRadius: 16,
                  border: "1px solid #e5e8eb",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(22,56,74,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: "rgba(22,56,74,0.06)",
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    marginBottom: 16,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    color: "#16384A",
                    marginBottom: 8,
                    fontSize: 16,
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ color: "#5A7080", fontSize: 14, lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CARA PAKAI */}
      <div style={{ background: "#16384A", padding: "90px 48px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "white",
              marginBottom: 12,
            }}
          >
            Cara Pakai
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              marginBottom: 56,
              fontSize: 15,
            }}
          >
            Tiga langkah mudah untuk menemukan barang hilangmu
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
            }}
          >
            {[
              {
                step: "01",
                title: "Daftar & Login",
                desc: "Buat akun dengan email kampus kamu",
              },
              {
                step: "02",
                title: "Lapor Barang",
                desc: "Isi form lengkap dengan foto dan lokasi",
              },
              {
                step: "03",
                title: "Klaim & Selesai",
                desc: "Ajukan klaim dan koordinasikan pengambilan",
              },
            ].map((s) => (
              <div key={s.step} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: "#D4A843",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    fontWeight: 900,
                    fontSize: 16,
                    color: "#16384A",
                  }}
                >
                  {s.step}
                </div>
                <h3
                  style={{ color: "white", fontWeight: 700, marginBottom: 8 }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          background: "#F7F7F5",
          padding: "90px 48px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: "#16384A",
            marginBottom: 14,
          }}
        >
          Kehilangan sesuatu?
        </h2>
        <p
          style={{
            color: "#5A7080",
            marginBottom: 36,
            fontSize: 16,
            maxWidth: 480,
            margin: "0 auto 36px",
          }}
        >
          Bergabung dengan ratusan mahasiswa Cakrawala yang sudah menemukan
          barang mereka kembali
        </p>
        <button
          onClick={() => navigate("/register")}
          style={{
            background: "#16384A",
            color: "white",
            border: "none",
            borderRadius: 30,
            padding: "16px 40px",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
            boxShadow: "0 8px 24px rgba(22,56,74,0.25)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
        >
          Daftar Gratis Sekarang →
        </button>
      </div>

      {/* FOOTER */}
      <div style={{ background: "#0F2535", padding: "28px 48px" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 16, color: "white" }}>
            Found@<span style={{ color: "#D4A843" }}>Cakrawala</span>
          </span>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
            © 2026 Cakrawala University. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
