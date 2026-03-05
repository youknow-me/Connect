const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ConversationParticipant = sequelize.define("ConversationParticipant", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "member"),
    defaultValue: "member",
  },
  lastReadAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "conversation_participants",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["conversationId", "userId"] },
  ],
});

module.exports = ConversationParticipant;
