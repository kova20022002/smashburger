const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const ProductVariant = sequelize.define("ProductVariant", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id"
      }
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  },{ timestamps: false });
  
  module.exports = ProductVariant;
  
