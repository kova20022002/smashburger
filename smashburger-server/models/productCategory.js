const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const ProductCategory = sequelize.define("ProductCategory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    
  }
},{ timestamps: false });

module.exports = ProductCategory;
