import { useState } from "react";
import Avatar from "../UI/Avatar";
import IconBtn from "../UI/IconBtn";
import ConvoItem from "./ConvoItem";

export default function Sidebar({ conversations, activeConvo, loading, onSelect, onNewChat, user }) {
  const [search, setSearch] = useState("");
  const [tab, setTab]       = useState("all");

  const filtered = conversations.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchTab =
      tab === "all" ||
      (tab === "groups" && c.type === "group") ||
      (tab === "dms"    && c.type === "dm");
    return matchSearch && matchTab;
  });

  return (
    <div style={{
      width: 300, background: "var(--bg-800)", display: "flex",
      flexDirection: "column", borderRight: "1px solid var(--border)", flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ padding: "20px 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name={user?.name || "U"} size={34} online={true} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: "var(--green)" }}>● Active</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <IconBtn title="New Chat" onClick={onNewChat}>✏️</IconBtn>
            <IconBtn title="Settings">⚙️</IconBtn>
          </div>
        </div>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--bg-700)", borderRadius: 10, padding: "9px 12px",
        }}>
          <span style={{ fontSize: 13, color: "var(--text-3)" }}>🔍</span>
          <input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--text-1)", fontSize: 13,
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-3)", fontSize: 14,
            }}>✕</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: "0 16px 12px" }}>
        {[["all", "All"], ["dms", "DMs"], ["groups", "Groups"]].map(([val, label]) => (
          <button key={val} onClick={() => setTab(val)} style={{
            flex: 1, padding: "6px 0", borderRadius: 8, border: "none", cursor: "pointer",
            background: tab === val ? "var(--bg-600)" : "transparent",
            color: tab === val ? "var(--text-1)" : "var(--text-3)",
            fontSize: 12, fontWeight: 600, transition: "all 0.15s",
          }}>{label}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => <SkeletonItem key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: "var(--text-3)", fontSize: 13 }}>
            {search ? "No results found" : "No conversations yet.\nClick ✏️ to start one!"}
          </div>
        ) : (
          filtered.map((c, i) => (
            <ConvoItem
              key={c.id} convo={c}
              active={activeConvo?.id === c.id}
              onClick={() => onSelect(c)}
              delay={i * 0.04}
            />
          ))
        )}
      </div>
    </div>
  );
}

function SkeletonItem() {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--bg-600)" }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 12, borderRadius: 6, background: "var(--bg-600)", width: "60%", marginBottom: 6 }} />
        <div style={{ height: 10, borderRadius: 6, background: "var(--bg-700)", width: "80%" }} />
      </div>
    </div>
  );
}
