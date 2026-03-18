import { useState } from "react";
import InputField from "../UI/InputField";

export default function Login({ onSubmit, loading }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const handle = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <InputField
          icon="✉️" placeholder="Email address" type="email"
          value={email} onChange={setEmail}
        />
        <InputField
          icon="🔑" placeholder="Password" type="password"
          value={password} onChange={setPassword}
        />
      </div>

      <button
        onClick={handle}
        disabled={loading || !email || !password}
        style={{
          width: "100%", marginTop: 22, padding: "13px 0", borderRadius: 12,
          border: "none",
          cursor: loading || !email || !password ? "not-allowed" : "pointer",
          background: loading || !email || !password ? "var(--bg-600)" : "var(--accent)",
          color: "#fff", fontSize: 15, fontWeight: 700, transition: "all 0.2s",
          boxShadow: !loading && email && password ? "0 6px 20px var(--accent-glow)" : "none",
        }}
      >
        {loading ? "Signing in..." : "Sign In →"}
      </button>

      <p style={{ textAlign: "center", marginTop: 14, color: "var(--text-3)", fontSize: 12 }}>
        Demo: any email + password works
      </p>
    </div>
  );
}
