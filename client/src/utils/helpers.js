/**
 * Format a date/time string for display in chat
 */
export function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], { day: "2-digit", month: "short" });
  }
}

/**
 * Return initials from a full name (max 2 chars)
 */
export function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Generate a deterministic color from a string
 */
const AVATAR_COLORS = [
  "#5b6af0", "#7c3aed", "#0891b2",
  "#059669", "#d97706", "#dc2626",
  "#db2777", "#0284c7",
];
export function getAvatarColor(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/**
 * Truncate a string to maxLen with ellipsis
 */
export function truncate(str = "", maxLen = 40) {
  return str.length > maxLen ? str.slice(0, maxLen) + "…" : str;
}

/**
 * Group messages by date for dividers
 */
export function groupMessagesByDate(messages = []) {
  const groups = {};
  messages.forEach((msg) => {
    const date = new Date(msg.createdAt);
    const key = date.toDateString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(msg);
  });
  return groups;
}

/**
 * Format file size in human readable form
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
