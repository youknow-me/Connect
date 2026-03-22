import { useState } from "react";
import Avatar from "../UI/Avatar";
import { formatTime, truncate } from "../../utils/helpers";

export default function ConvoItem({ convo, active, onClick, delay = 0 }) {
  const [hovered, setHovered] = useState(false);

  const bg = active ? "var(--bg-600)" : hovered ? "var(--bg-700)" : "transparent";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "11px 16px", cursor: "pointer",
        background: bg, transition: "background 0.15s",
        borderLeft: `3px solid ${active ? "var(--accent)" : "transparent"}`,
        animation: `slideIn 0.3s ease ${delay}s both`,
      }}
    >
      {/* Avatar */}
      {convo.type === "group" ? (
        <div style={{
          width: 42, height: 42, borderRadius: 14, flexShrink: 0,
          background: "linear-gradient(135deg, #7c3aed, #5b6af0)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>👥</div>
      ) : (
        <Avatar name={convo.name} size={42} online={convo.isOnline} />
      )}

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{convo.name}</span>
          <span style={{ fontSize: 11, color: "var(--text-3)", flexShrink: 0, marginLeft: 4 }}>
            {formatTime(convo.lastMessageTime)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
          <span style={{
            fontSize: 12, color: "var(--text-3)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            maxWidth: convo.unreadCount > 0 ? 160 : "100%",
          }}>
            {truncate(convo.lastMessage || "Start a conversation", 38)}
          </span>
          {convo.unreadCount > 0 && (
            <span style={{
              background: "var(--accent)", color: "#fff", borderRadius: 10,
              padding: "1px 7px", fontSize: 10, fontWeight: 700, flexShrink: 0,
            }}>{convo.unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
}
