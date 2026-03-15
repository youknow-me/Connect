const jwt  = require("jsonwebtoken");
const { User, Message, ConversationParticipant } = require("../models");

// Map userId → Set of socketIds (user can have multiple tabs)
const onlineUsers = new Map();

module.exports = (io) => {

  // ── Auth middleware for sockets ─────────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user    = await User.findByPk(decoded.id, {
        attributes: ["id", "name", "avatar", "isOnline"],
      });
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  // ── Connection ──────────────────────────────────────────────────────────────
  io.on("connection", async (socket) => {
    const userId = socket.user.id;
    console.log(`🟢 User connected: ${socket.user.name} [${socket.id}]`);

    // Track socket
    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    // Update DB
    await User.update(
      { isOnline: true, socketId: socket.id },
      { where: { id: userId } }
    );

    // Broadcast to all that this user is online
    socket.broadcast.emit("user_online", userId);

    // Send current online list to this socket
    socket.emit("online_users", [...onlineUsers.keys()]);

    // ── Join rooms for all user's conversations ───────────────────────────────
    const participations = await ConversationParticipant.findAll({ where: { userId } });
    participations.forEach((p) => socket.join(`convo:${p.conversationId}`));

    // ── Events ────────────────────────────────────────────────────────────────

    // Client wants to join a specific room
    socket.on("join_room", (conversationId) => {
      socket.join(`convo:${conversationId}`);
    });

    socket.on("leave_room", (conversationId) => {
      socket.leave(`convo:${conversationId}`);
    });

    // New message broadcast (after it's saved via REST, client emits this)
    socket.on("send_message", (message) => {
      socket.to(`convo:${message.conversationId}`).emit("new_message", message);

      // Update status to "delivered" for online recipients
      io.to(`convo:${message.conversationId}`).emit("message_status", {
        messageId: message.id,
        status: "delivered",
      });
    });

    // Typing indicator
    socket.on("typing", async ({ conversationId }) => {
      socket.to(`convo:${conversationId}`).emit("typing", {
        conversationId,
        userId,
        userName: socket.user.name,
      });
    });

    socket.on("stop_typing", ({ conversationId }) => {
      socket.to(`convo:${conversationId}`).emit("stop_typing", {
        conversationId,
        userId,
      });
    });

    // Message read receipt
    socket.on("message_read", async ({ messageId, conversationId }) => {
      try {
        await Message.update({ status: "read" }, { where: { id: messageId } });
        socket.to(`convo:${conversationId}`).emit("message_status", {
          messageId,
          status: "read",
        });
      } catch (err) {
        console.error("Read receipt error:", err.message);
      }
    });

    // ── Disconnect ────────────────────────────────────────────────────────────
    socket.on("disconnect", async () => {
      console.log(`🔴 User disconnected: ${socket.user.name} [${socket.id}]`);

      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);

          // Mark offline in DB
          await User.update(
            { isOnline: false, lastSeen: new Date(), socketId: null },
            { where: { id: userId } }
          );

          // Broadcast offline
          io.emit("user_offline", userId);
        }
      }
    });
  });
};
