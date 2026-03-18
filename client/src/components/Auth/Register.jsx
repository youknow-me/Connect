import { useState } from "react";
import InputField from "../UI/InputField";

export default function Register({ onSubmit, loading }) {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [err, setErr]           = useState("");

  const handle = (e) => {
    e.preventDefault();
    if (password !== confirm) { setErr("Passwords don't match"); return; }
    if (password.length < 6)  { setErr("Password must be at least 6 characters"); return; }
    setErr("");
    onSubmit(name, email, password);
  };

  return (
    <div>
      {err && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 8, padding: "8px 12px", marginBottom: 14,
          color: "var(--red)", fontSize: 13,
        }}>{err}</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <InputField icon="👤" placeholder="Full Name" value={name} onChange={setName} />
        <InputField icon="✉️" placeholder="Email address" type="email" value={email} onChange={setEmail} />
        <InputField icon="🔑" placeholder="Password" type="password" value={password} onChange={setPassword} />
        <InputField icon="🔒" placeholder="Confirm Password" type="password" value={confirm} onChange={setConfirm} />
      </div>

      <button
        onClick={handle}
        disabled={loading || !name || !email || !password}
        style={{
          width: "100%", marginTop: 22, padding: "13px 0", borderRadius: 12,
          border: "none",
          cursor: loading || !name || !email || !password ? "not-allowed" : "pointer",
          background: loading || !name || !email || !password ? "var(--bg-600)" : "var(--accent)",
          color: "#fff", fontSize: 15, fontWeight: 700, transition: "all 0.2s",
          boxShadow: !loading && name && email && password ? "0 6px 20px var(--accent-glow)" : "none",
        }}
      >
        {loading ? "Creating account..." : "Create Account →"}
      </button>
    </div>
  );
}
