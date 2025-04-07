const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const { DataTypes } = require("sequelize");

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    adress: {
        type: Sequelize.STRING,
        allowNull: true
      },
    adressNumber: {
        type: Sequelize.STRING,
        allowNull: true
    },
    floor: {
        type: Sequelize.STRING,
        allowNull: true
      },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true
    },
    note: {
        type: Sequelize.STRING,
        allowNull: true
      },
    role: {
        type: DataTypes.ENUM,
        defaultValue: "user", // Default role
        values: ["admin", "user"],
      },
});

module.exports = User;
