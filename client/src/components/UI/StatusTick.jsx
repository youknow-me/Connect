/**
 * Shows ✓ sent  ✓✓ delivered  🔵✓✓ read
 */
export default function StatusTick({ status }) {
  if (status === "sent")
    return <span style={{ color: "var(--text-3)", fontSize: 11 }}>✓</span>;
  if (status === "delivered")
    return <span style={{ color: "var(--text-2)", fontSize: 11 }}>✓✓</span>;
  if (status === "read")
    return <span style={{ color: "var(--accent-light)", fontSize: 11 }}>✓✓</span>;
  return null;
}
