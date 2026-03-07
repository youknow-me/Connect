const sequelize              = require("../config/db");
const User                   = require("./User");
const Conversation           = require("./Conversation");
const ConversationParticipant = require("./ConversationParticipant");
const Message                = require("./Message");

// ── Associations ──────────────────────────────────────────────────────────────

// A Conversation has many Participants (Users) through junction table
Conversation.belongsToMany(User, {
  through: ConversationParticipant,
  foreignKey: "conversationId",
  as: "participants",
});
User.belongsToMany(Conversation, {
  through: ConversationParticipant,
  foreignKey: "userId",
  as: "conversations",
});

// A Conversation has many Messages
Conversation.hasMany(Message, { foreignKey: "conversationId", as: "messages" });
Message.belongsTo(Conversation, { foreignKey: "conversationId" });

// A Message belongs to a sender (User)
Message.belongsTo(User, { foreignKey: "senderId", as: "sender" });
User.hasMany(Message, { foreignKey: "senderId" });

// A Conversation is created by a User
Conversation.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// Direct access to pivot table
ConversationParticipant.belongsTo(User, { foreignKey: "userId", as: "user" });
ConversationParticipant.belongsTo(Conversation, { foreignKey: "conversationId" });

module.exports = {
  sequelize,
  User,
  Conversation,
  ConversationParticipant,
  Message,
};
