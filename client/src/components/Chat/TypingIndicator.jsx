export default function TypingIndicator({ names = [] }) {
  if (names.length === 0) return null;

  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : "Several people are typing";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, animation: "fadeIn 0.3s" }}>
      <div style={{
        background: "var(--bg-700)", borderRadius: "18px 18px 18px 4px",
        padding: "10px 14px", display: "inline-flex", alignItems: "center", gap: 8,
      }}>
        <Dots />
        <span style={{ fontSize: 12, color: "var(--text-3)" }}>{label}</span>
      </div>
    </div>
  );
}

function Dots() {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "var(--text-2)",
          animation: `blink 1.4s ease infinite`,
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  );
}
