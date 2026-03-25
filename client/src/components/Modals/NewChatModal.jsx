import { useState, useEffect } from "react";
import Avatar from "../UI/Avatar";
import { userService } from "../../services/conversationService";

export default function NewChatModal({ onClose, onCreate }) {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState([]);
  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await userService.search(query);
        setResults(res.data.users);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const toggle = (user) => {
    setSelected((s) =>
      s.find((u) => u.id === user.id) ? s.filter((u) => u.id !== user.id) : [...s, user]
    );
  };

  const create = () => {
    if (selected.length === 0) return;
    if (selected.length === 1) {
      onCreate({ userId: selected[0].id });
    } else {
      onCreate({ name: groupName || selected.map((u) => u.name.split(" ")[0]).join(", "), memberIds: selected.map((u) => u.id) });
    }
    onClose();
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, animation: "fadeIn 0.2s",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--bg-800)", borderRadius: 20, padding: 28, width: 400,
        border: "1px solid var(--border)", animation: "popIn 0.25s ease",
        maxHeight: "80vh", display: "flex", flexDirection: "column",
      }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 20 }}>
          New Conversation
        </h2>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--bg-700)", borderRadius: 10, padding: "10px 14px", marginBottom: 14,
        }}>
          <span>🔍</span>
          <input
            autoFocus
            placeholder="Search users by name or email..."
            value={query} onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--text-1)", fontSize: 14,
            }}
          />
          {searching && <span style={{ fontSize: 12, color: "var(--text-3)" }}>...</span>}
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {selected.map((u) => (
              <span key={u.id} onClick={() => toggle(u)} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "var(--accent)", color: "#fff",
                borderRadius: 20, padding: "4px 10px 4px 8px", fontSize: 12, cursor: "pointer",
              }}>
                {u.name.split(" ")[0]} ✕
              </span>
            ))}
          </div>
        )}

        {/* Results */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {results.map((u) => {
            const isSelected = !!selected.find((s) => s.id === u.id);
            return (
              <div key={u.id} onClick={() => toggle(u)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px", borderRadius: 12, cursor: "pointer", marginBottom: 4,
                background: isSelected ? "var(--bg-600)" : "var(--bg-700)",
                border: `1px solid ${isSelected ? "var(--accent)" : "transparent"}`,
                transition: "all 0.15s",
              }}>
                <Avatar name={u.name} size={36} online={u.isOnline} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)" }}>{u.email}</div>
                </div>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: `2px solid ${isSelected ? "var(--accent)" : "var(--text-3)"}`,
                  background: isSelected ? "var(--accent)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: "#fff",
                }}>{isSelected ? "✓" : ""}</div>
              </div>
            );
          })}
          {query.length >= 2 && results.length === 0 && !searching && (
            <div style={{ textAlign: "center", color: "var(--text-3)", fontSize: 13, padding: 20 }}>
              No users found for "{query}"
            </div>
          )}
          {query.length < 2 && (
            <div style={{ textAlign: "center", color: "var(--text-3)", fontSize: 13, padding: 20 }}>
              Type at least 2 characters to search
            </div>
          )}
        </div>

        {/* Group name input */}
        {selected.length > 1 && (
          <div style={{ marginTop: 14 }}>
            <input
              placeholder="Group name (optional)..."
              value={groupName} onChange={(e) => setGroupName(e.target.value)}
              style={{
                width: "100%", background: "var(--bg-700)", border: "1px solid var(--border)",
                borderRadius: 10, padding: "10px 14px", color: "var(--text-1)", fontSize: 14,
                outline: "none",
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px 0", borderRadius: 10,
            border: "1px solid var(--border)", background: "transparent",
            color: "var(--text-2)", fontSize: 14, fontWeight: 600,
          }}>Cancel</button>
          <button onClick={create} disabled={selected.length === 0} style={{
            flex: 2, padding: "11px 0", borderRadius: 10, border: "none",
            background: selected.length === 0 ? "var(--bg-600)" : "var(--accent)",
            color: "#fff", fontSize: 14, fontWeight: 700,
            cursor: selected.length === 0 ? "not-allowed" : "pointer",
            boxShadow: selected.length > 0 ? "0 4px 16px var(--accent-glow)" : "none",
          }}>
            {selected.length > 1 ? "Create Group" : "Start Chat"} →
          </button>
        </div>
      </div>
    </div>
  );
}
