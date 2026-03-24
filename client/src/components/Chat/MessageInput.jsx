import { useState, useRef } from "react";
import { useTyping } from "../../hooks/useTyping";

const EMOJIS = ["😂","❤️","🔥","👍","😭","🙏","😍","🚀","💯","🎉","👀","💀","✨","🤝","😎","🤣","🥳","👏","🫡","💪"];

export default function MessageInput({ onSend, onTyping }) {
  const [input, setInput]         = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const fileRef                   = useRef(null);
  const { handleTyping, stopTyping } = useTyping(onTyping);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text, "text");
    setInput("");
    setShowEmoji(false);
    stopTyping();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    handleTyping();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // In real app: upload to server via FormData, then send message with fileUrl
    console.log("File selected:", file.name);
    // onSend(file.name, file.type.startsWith("image/") ? "image" : "file");
  };

  return (
    <div style={{ flexShrink: 0 }}>
      {/* Emoji Picker */}
      {showEmoji && (
        <div style={{
          background: "var(--bg-800)", borderTop: "1px solid var(--border)",
          padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: 6,
          animation: "fadeUp 0.2s ease",
        }}>
          {EMOJIS.map((e) => (
            <button key={e} onClick={() => setInput((v) => v + e)} style={{
              fontSize: 22, background: "none", border: "none", cursor: "pointer",
              padding: "4px 5px", borderRadius: 8, transition: "background 0.1s",
              lineHeight: 1,
            }}
              onMouseEnter={(ev) => ev.currentTarget.style.background = "var(--bg-600)"}
              onMouseLeave={(ev) => ev.currentTarget.style.background = "none"}
            >{e}</button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{
        padding: "12px 16px", borderTop: "1px solid var(--border)",
        background: "var(--bg-800)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "var(--bg-700)", borderRadius: 14, padding: "8px 12px",
          border: "1px solid var(--border)",
        }}>
          <button onClick={() => setShowEmoji((s) => !s)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 20, padding: "2px 4px", borderRadius: 6,
            color: showEmoji ? "var(--accent)" : "inherit",
          }}>😊</button>

          <input
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={stopTyping}
            placeholder="Type a message..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--text-1)", fontSize: 14, minWidth: 0,
            }}
          />

          {/* File attach */}
          <button onClick={() => fileRef.current?.click()} style={{
            background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: "2px 4px",
          }}>📎</button>
          <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleFileChange} />

          {/* Send */}
          <button
            onClick={send}
            disabled={!input.trim()}
            style={{
              width: 36, height: 36, borderRadius: 10, border: "none",
              background: input.trim() ? "var(--accent)" : "var(--bg-600)",
              cursor: input.trim() ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, transition: "all 0.15s", flexShrink: 0,
              boxShadow: input.trim() ? "0 4px 12px var(--accent-glow)" : "none",
            }}
          >➤</button>
        </div>

        <div style={{ fontSize: 11, color: "var(--text-3)", textAlign: "center", marginTop: 6 }}>
          Enter to send &nbsp;·&nbsp; Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
