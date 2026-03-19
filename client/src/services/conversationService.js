import api from "./api";

export const conversationService = {
  getAll: () => api.get("/api/conversations"),

  create: (data) => api.post("/api/conversations", data),
  // data: { userId } for DM  OR  { name, memberIds } for group

  getMessages: (conversationId, page = 1) =>
    api.get(`/api/conversations/${conversationId}/messages?page=${page}`),

  markRead: (conversationId) =>
    api.put(`/api/conversations/${conversationId}/read`),
};

export const messageService = {
  send: (data) => api.post("/api/messages", data),
  // data: { conversationId, content, type }

  delete: (messageId) => api.delete(`/api/messages/${messageId}`),

  edit: (messageId, content) => api.put(`/api/messages/${messageId}`, { content }),
};

export const userService = {
  search: (q) => api.get(`/api/users/search?q=${q}`),

  updateProfile: (data) => api.put("/api/users/profile", data),

  uploadAvatar: (formData) =>
    api.post("/api/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
