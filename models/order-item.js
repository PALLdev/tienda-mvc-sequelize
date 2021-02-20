const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const OrderItem = sequelize.define("itemsPedido", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  cantidad: DataTypes.INTEGER,
});

module.exports = OrderItem;
