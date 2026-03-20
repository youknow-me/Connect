import { useState } from "react";

export default function IconBtn({ children, onClick, title, active = false, size = 32 }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: size, height: size, borderRadius: size * 0.25,
        border: "none", cursor: "pointer",
        background: active || hovered ? "var(--bg-600)" : "var(--bg-700)",
        fontSize: size * 0.45,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.15s",
        color: active ? "var(--accent-light)" : "inherit",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
