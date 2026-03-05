const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Conversation = sequelize.define("Conversation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,     // null for DMs
  },
  type: {
    type: DataTypes.ENUM("dm", "group"),
    defaultValue: "dm",
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  groupAvatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "conversations",
  timestamps: true,
});

module.exports = Conversation;
