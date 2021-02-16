const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Cart = sequelize.define("Carros", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Cart;
