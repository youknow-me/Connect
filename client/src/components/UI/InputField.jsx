import { useState } from "react";

export default function InputField({ icon, placeholder, type = "text", value, onChange }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "var(--bg-700)", borderRadius: 10, padding: "11px 14px",
      border: `1px solid ${focused ? "var(--accent)" : "var(--border)"}`,
      transition: "border-color 0.2s",
    }}>
      <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1, background: "transparent", border: "none", outline: "none",
          color: "var(--text-1)", fontSize: 14,
        }}
      />
    </div>
  );
}
