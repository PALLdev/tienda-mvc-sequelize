const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const CartItem = sequelize.define("ItemsCarro", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  cantidad: DataTypes.INTEGER,
});

module.exports = CartItem;
