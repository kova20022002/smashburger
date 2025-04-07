const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const OrderItem = sequelize.define("OrderItem", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id"
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id"
      }
    },
    variantId: {
      type: DataTypes.INTEGER,
      allowNull: true, 
      references: {
        model: "ProductVariants",
        key: "id"
      }
    },
    smashburgerPanId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Products",
        key: "id"
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  });
  
  module.exports = OrderItem;
  