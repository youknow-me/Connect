import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name, email, password) => {
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg-900)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background glow blobs */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(91,106,240,0.12) 0%, transparent 70%)",
        top: -200, right: -100, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
        bottom: -100, left: -50, pointerEvents: "none",
      }} />

      <div style={{ width: 420, animation: "popIn 0.4s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: 26,
            boxShadow: "0 0 32px var(--accent-glow)",
          }}>💬</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: "-0.5px" }}>NEXUS</h1>
          <p style={{ color: "var(--text-2)", fontSize: 14, marginTop: 4 }}>
            College Chat — Stay Connected
          </p>
        </div>

        <div style={{
          background: "var(--bg-800)", borderRadius: 20,
          border: "1px solid var(--border)", padding: 32,
          boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
        }}>
          {/* Toggle tabs */}
          <div style={{
            display: "flex", background: "var(--bg-700)", borderRadius: 10,
            padding: 4, marginBottom: 28,
          }}>
            {[["login", "Sign In"], ["register", "Register"]].map(([m, label]) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
                background: mode === m ? "var(--accent)" : "transparent",
                color: mode === m ? "#fff" : "var(--text-2)",
                fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                boxShadow: mode === m ? "0 4px 12px var(--accent-glow)" : "none",
              }}>{label}</button>
            ))}
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 10, padding: "10px 14px", marginBottom: 18,
              color: "var(--red)", fontSize: 13,
            }}>{error}</div>
          )}

          {mode === "login"
            ? <Login onSubmit={handleLogin} loading={loading} />
            : <Register onSubmit={handleRegister} loading={loading} />
          }
        </div>
      </div>
    </div>
  );
}
