const { Op } = require("sequelize");
const { Conversation, ConversationParticipant, Message, User } = require("../models");

// GET /api/conversations
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all conversations the user is part of
    const participations = await ConversationParticipant.findAll({
      where: { userId },
      include: [{
        model: Conversation,
        include: [
          {
            model: User,
            as: "participants",
            attributes: ["id", "name", "avatar", "isOnline", "lastSeen"],
            through: { attributes: ["role"] },
          },
          {
            model: Message,
            as: "messages",
            limit: 1,
            order: [["createdAt", "DESC"]],
            include: [{ model: User, as: "sender", attributes: ["id", "name"] }],
          },
        ],
      }],
      order: [["createdAt", "DESC"]],
    });

    const conversations = await Promise.all(
      participations.map(async (p) => {
        const convo = p.Conversation;
        const lastMsg = convo.messages?.[0];

        // Count unread messages
        const unreadCount = await Message.count({
          where: {
            conversationId: convo.id,
            senderId: { [Op.ne]: userId },
            createdAt: { [Op.gt]: p.lastReadAt || new Date(0) },
          },
        });

        // For DMs, use the other person's name
        let name = convo.name;
        let isOnline = null;
        if (convo.type === "dm") {
          const other = convo.participants.find((u) => u.id !== userId);
          name     = other?.name || "Unknown";
          isOnline = other?.isOnline || false;
        }

        return {
          id: convo.id,
          type: convo.type,
          name,
          isOnline,
          participants: convo.participants,
          lastMessage: lastMsg?.content || null,
          lastMessageTime: lastMsg?.createdAt || convo.createdAt,
          unreadCount,
        };
      })
    );

    // Sort by most recent message
    conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    res.json({ conversations });
  } catch (err) { next(err); }
};

// POST /api/conversations
const createConversation = async (req, res, next) => {
  try {
    const { userId, name, memberIds } = req.body;
    const creatorId = req.user.id;

    // DM — check if already exists
    if (userId) {
      const existing = await ConversationParticipant.findAll({
        where: { userId: creatorId },
        include: [{
          model: Conversation,
          where: { type: "dm" },
          include: [{
            model: User, as: "participants",
            through: { attributes: [] },
            where: { id: userId },
          }],
        }],
      });
      if (existing.length > 0) {
        return res.json({ conversation: existing[0].Conversation });
      }

      const convo = await Conversation.create({ type: "dm", createdBy: creatorId });
      await ConversationParticipant.bulkCreate([
        { conversationId: convo.id, userId: creatorId, role: "admin" },
        { conversationId: convo.id, userId,            role: "member" },
      ]);
      return res.status(201).json({ conversation: convo });
    }

    // Group
    if (!memberIds || memberIds.length < 2) {
      return res.status(400).json({ message: "Group needs at least 2 members" });
    }

    const convo = await Conversation.create({
      type: "group", name: name || "New Group", createdBy: creatorId,
    });

    const participants = [
      { conversationId: convo.id, userId: creatorId, role: "admin" },
      ...memberIds.map((id) => ({ conversationId: convo.id, userId: id, role: "member" })),
    ];
    await ConversationParticipant.bulkCreate(participants);

    res.status(201).json({ conversation: convo });
  } catch (err) { next(err); }
};

// GET /api/conversations/:id/messages
const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page   = parseInt(req.query.page) || 1;
    const limit  = 50;
    const offset = (page - 1) * limit;

    // Check membership
    const member = await ConversationParticipant.findOne({
      where: { conversationId: id, userId: req.user.id },
    });
    if (!member) return res.status(403).json({ message: "Not a member of this conversation" });

    const { rows: messages, count } = await Message.findAndCountAll({
      where: { conversationId: id, isDeleted: false },
      include: [{ model: User, as: "sender", attributes: ["id", "name", "avatar"] }],
      order: [["createdAt", "ASC"]],
      limit,
      offset,
    });

    res.json({ messages, total: count, page, pages: Math.ceil(count / limit) });
  } catch (err) { next(err); }
};

// PUT /api/conversations/:id/read
const markRead = async (req, res, next) => {
  try {
    await ConversationParticipant.update(
      { lastReadAt: new Date() },
      { where: { conversationId: req.params.id, userId: req.user.id } }
    );
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getConversations, createConversation, getMessages, markRead };
