import { getInitials, getAvatarColor } from "../../utils/helpers";

export default function Avatar({ name = "", src = null, size = 38, online = null }) {
  const initials = getInitials(name);
  const bg       = getAvatarColor(name);

  return (
    <div style={{ position: "relative", flexShrink: 0, width: size, height: size }}>
      {src ? (
        <img
          src={src} alt={name}
          style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
        <div style={{
          width: size, height: size, borderRadius: "50%", background: bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: size * 0.34, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px",
          userSelect: "none",
        }}>
          {initials}
        </div>
      )}

      {online !== null && (
        <span style={{
          position: "absolute", bottom: 1, right: 1,
          width: Math.max(size * 0.28, 8),
          height: Math.max(size * 0.28, 8),
          borderRadius: "50%",
          background: online ? "var(--green)" : "var(--text-3)",
          border: "2px solid var(--bg-800)",
        }} />
      )}
    </div>
  );
}
