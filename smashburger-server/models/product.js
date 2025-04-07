const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");
const { ProductCategory } = require("./productCategory")

const Product = sequelize.define("Product", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ingredients:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductCategory,
        key: 'id'
      }
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    }
  },{ timestamps: false });
  
  module.exports = Product;
  
  
