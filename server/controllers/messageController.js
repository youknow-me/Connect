const { Message, User, ConversationParticipant } = require("../models");

// POST /api/messages
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content, type = "text", fileUrl, fileName, fileSize } = req.body;
    const senderId = req.user.id;

    if (!conversationId) return res.status(400).json({ message: "conversationId required" });
    if (type === "text" && !content?.trim()) return res.status(400).json({ message: "Content required" });

    // Confirm sender is a member
    const member = await ConversationParticipant.findOne({ where: { conversationId, userId: senderId } });
    if (!member) return res.status(403).json({ message: "Not a member" });

    const message = await Message.create({
      conversationId, senderId, content, type, fileUrl, fileName, fileSize, status: "sent",
    });

    // Fetch with sender info for response
    const full = await Message.findByPk(message.id, {
      include: [{ model: User, as: "sender", attributes: ["id", "name", "avatar"] }],
    });

    res.status(201).json({ message: full });
  } catch (err) { next(err); }
};

// DELETE /api/messages/:id
const deleteMessage = async (req, res, next) => {
  try {
    const msg = await Message.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });
    if (msg.senderId !== req.user.id) return res.status(403).json({ message: "Not your message" });

    await msg.update({ isDeleted: true, content: "This message was deleted" });
    res.json({ success: true });
  } catch (err) { next(err); }
};

// PUT /api/messages/:id
const editMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const msg = await Message.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });
    if (msg.senderId !== req.user.id) return res.status(403).json({ message: "Not your message" });
    if (msg.type !== "text") return res.status(400).json({ message: "Can only edit text messages" });

    await msg.update({ content });
    res.json({ message: msg });
  } catch (err) { next(err); }
};

module.exports = { sendMessage, deleteMessage, editMessage };
