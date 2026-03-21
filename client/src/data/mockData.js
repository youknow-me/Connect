export const MOCK_USER = {
  id: 1,
  name: "You",
  email: "you@example.com",
  avatar: null,
  isOnline: true,
};

export const MOCK_CONVERSATIONS = [
  {
    id: 1, type: "dm", unreadCount: 2,
    name: "Priya Sharma", avatar: null, initials: "PS", isOnline: true,
    lastMessage: "Yeah the demo is at 3 PM tomorrow 🚀",
    lastMessageTime: new Date(Date.now() - 120000).toISOString(),
    participants: [{ id: 2, name: "Priya Sharma" }],
  },
  {
    id: 2, type: "group", unreadCount: 5,
    name: "CS Project Team", avatar: null, initials: "CP", isOnline: null,
    lastMessage: "Arjun: pushed the latest commit",
    lastMessageTime: new Date(Date.now() - 900000).toISOString(),
    participants: [{ id: 2 }, { id: 3 }, { id: 4 }],
  },
  {
    id: 3, type: "dm", unreadCount: 0,
    name: "Dev Patel", avatar: null, initials: "DP", isOnline: true,
    lastMessage: "Can you review my PR?",
    lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
    participants: [{ id: 4, name: "Dev Patel" }],
  },
];

export const MOCK_MESSAGES = {
  1: [
    { id: 1, senderId: 2, senderName: "Priya Sharma", content: "Hey! Did you finish the backend part?", type: "text", status: "read", createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, senderId: 1, senderName: "You", content: "Almost done, just the socket stuff left", type: "text", status: "read", createdAt: new Date(Date.now() - 3500000).toISOString() },
    { id: 3, senderId: 2, senderName: "Priya Sharma", content: "Perfect. Prof said to keep the demo short", type: "text", status: "read", createdAt: new Date(Date.now() - 3400000).toISOString() },
    { id: 4, senderId: 1, senderName: "You", content: "How long do we have?", type: "text", status: "read", createdAt: new Date(Date.now() - 3300000).toISOString() },
    { id: 5, senderId: 2, senderName: "Priya Sharma", content: "Yeah the demo is at 3 PM tomorrow 🚀", type: "text", status: "delivered", createdAt: new Date(Date.now() - 120000).toISOString() },
  ],
};
