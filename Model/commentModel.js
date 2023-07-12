const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("comment", {
    Comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  return Comment;
};
