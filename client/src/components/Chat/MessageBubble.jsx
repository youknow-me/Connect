import Avatar from "../UI/Avatar";
import StatusTick from "../UI/StatusTick";
import { formatTime } from "../../utils/helpers";

export default function MessageBubble({ msg, isMe, isGroup, delay = 0 }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: isMe ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 8,
      marginBottom: 10,
      animation: `fadeUp 0.25s ease ${delay}s both`,
    }}>
      {/* Avatar — only for others in group */}
      {!isMe && isGroup && (
        <Avatar name={msg.senderName || "?"} size={28} />
      )}

      <div style={{
        maxWidth: "65%",
        display: "flex", flexDirection: "column",
        alignItems: isMe ? "flex-end" : "flex-start",
      }}>
        {/* Sender name in groups */}
        {!isMe && isGroup && (
          <span style={{
            fontSize: 11, color: "var(--accent-light)", fontWeight: 600,
            marginBottom: 3, marginLeft: 2,
          }}>
            {msg.senderName}
          </span>
        )}

        {/* Bubble */}
        {msg.type === "image" ? (
          <img
            src={msg.fileUrl} alt="shared"
            style={{
              maxWidth: 240, borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              display: "block",
            }}
          />
        ) : msg.type === "file" ? (
          <FileBubble msg={msg} isMe={isMe} />
        ) : (
          <div style={{
            padding: "10px 14px",
            borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: isMe ? "var(--accent)" : "var(--bg-700)",
            color: "var(--text-1)", fontSize: 14, lineHeight: 1.5,
            wordBreak: "break-word",
            boxShadow: isMe ? "0 4px 12px var(--accent-glow)" : "none",
          }}>
            {msg.content}
          </div>
        )}

        {/* Time + status */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
          <span style={{ fontSize: 10, color: "var(--text-3)" }}>
            {formatTime(msg.createdAt)}
          </span>
          {isMe && <StatusTick status={msg.status} />}
        </div>
      </div>
    </div>
  );
}

function FileBubble({ msg, isMe }) {
  return (
    <a href={msg.fileUrl} target="_blank" rel="noreferrer" style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 14px", textDecoration: "none",
      borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
      background: isMe ? "var(--accent)" : "var(--bg-700)",
      color: "var(--text-1)",
    }}>
      <span style={{ fontSize: 24 }}>📄</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{msg.fileName || "File"}</div>
        <div style={{ fontSize: 11, color: isMe ? "rgba(255,255,255,0.7)" : "var(--text-3)" }}>
          {msg.fileSize || ""}
        </div>
      </div>
    </a>
  );
}
