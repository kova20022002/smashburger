const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      }
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "preparation", "delivering" ,"canceled", "completed"),
      defaultValue: "pending",
    },
    preparationTime:{
      type: DataTypes.INTEGER,
      defaultValue: 5,
    },
    startTime: {
      type: DataTypes.TIME, // Stores only the time (HH:MM:SS)
      allowNull: true,
  }
  });
  
  module.exports = Order;
  