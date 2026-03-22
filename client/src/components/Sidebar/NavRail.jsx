import { useState } from "react";
import Avatar from "../UI/Avatar";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { icon: "💬", label: "Chats",         id: "chats" },
  { icon: "👥", label: "Groups",        id: "groups" },
  { icon: "🔔", label: "Notifications", id: "notifications" },
  { icon: "📁", label: "Files",         id: "files" },
];

export default function NavRail({ user }) {
  const [active, setActive] = useState("chats");
  const { logout } = useAuth();

  return (
    <div style={{
      width: 60, background: "var(--bg-900)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "16px 0", borderRight: "1px solid var(--border)",
      gap: 8, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        width: 38, height: 38, borderRadius: 12, background: "var(--accent)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, marginBottom: 12,
        boxShadow: "0 4px 16px var(--accent-glow)",
      }}>💬</div>

      {/* Nav items */}
      {NAV_ITEMS.map(({ icon, label, id }) => (
        <NavBtn key={id} icon={icon} label={label}
          active={active === id}
          onClick={() => setActive(id)}
        />
      ))}

      <div style={{ flex: 1 }} />

      {/* Logout */}
      <NavBtn icon="🚪" label="Logout" onClick={logout} />

      {/* User avatar */}
      <div style={{ marginTop: 4 }}>
        <Avatar name={user?.name || "U"} size={34} online={true} />
      </div>
    </div>
  );
}

function NavBtn({ icon, label, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      title={label}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 42, height: 42, borderRadius: 12, border: "none", cursor: "pointer",
        background: active ? "var(--bg-700)" : hovered ? "var(--bg-800)" : "transparent",
        fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.15s",
        boxShadow: active ? "0 0 0 1px var(--border)" : "none",
      }}
    >{icon}</button>
  );
}
