import { useEffect, useRef } from "react";
import Avatar from "../UI/Avatar";
import IconBtn from "../UI/IconBtn";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import MessageInput from "./MessageInput";
import { groupMessagesByDate } from "../../utils/helpers";

export default function ChatWindow({ convo, messages, typingUsers, loading, currentUser, onSend, onTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // Empty state
  if (!convo) {
    return (
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "var(--bg-900)", color: "var(--text-3)",
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>💬</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text-2)", marginBottom: 8 }}>
          Welcome to NEXUS
        </h2>
        <p style={{ fontSize: 14 }}>Select a conversation to start chatting</p>
      </div>
    );
  }

  const typingNames = Object.values(typingUsers);
  const grouped     = groupMessagesByDate(messages);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-900)", minWidth: 0 }}>
      {/* Header */}
      <ChatHeader convo={convo} />

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 8px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              border: "3px solid var(--bg-600)", borderTopColor: "var(--accent)",
              animation: "spin 0.8s linear infinite",
            }} />
          </div>
        ) : (
          Object.entries(grouped).map(([dateStr, msgs]) => (
            <div key={dateStr}>
              <DateDivider label={formatDateLabel(dateStr)} />
              {msgs.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isMe={msg.senderId === currentUser?.id}
                  isGroup={convo.type === "group"}
                  delay={i * 0.03}
                />
              ))}
            </div>
          ))
        )}

        {/* Typing indicator */}
        {typingNames.length > 0 && (
          <TypingIndicator name={convo} names={typingNames} />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={onSend} onTyping={onTyping} />
    </div>
  );
}

function ChatHeader({ convo }) {
  const subtitle =
    convo.type === "group"
      ? `${(convo.participants?.length || 0) + 1} members`
      : convo.isOnline
      ? "Online"
      : `Last seen ${convo.lastSeen || "recently"}`;

  return (
    <div style={{
      padding: "14px 20px", borderBottom: "1px solid var(--border)",
      background: "var(--bg-800)", display: "flex",
      alignItems: "center", justifyContent: "space-between", flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {convo.type === "group" ? (
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: "linear-gradient(135deg, #7c3aed, #5b6af0)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>👥</div>
        ) : (
          <Avatar name={convo.name} size={40} online={convo.isOnline} />
        )}
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{convo.name}</div>
          <div style={{ fontSize: 12, color: convo.isOnline ? "var(--green)" : "var(--text-3)" }}>
            {subtitle}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <IconBtn title="Voice Call">📞</IconBtn>
        <IconBtn title="Video Call">📹</IconBtn>
        <IconBtn title="Search">🔍</IconBtn>
        <IconBtn title="Info">ℹ️</IconBtn>
      </div>
    </div>
  );
}

function DateDivider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 16px" }}>
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.5px" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}
