const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Order = sequelize.define("pedidos", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Order;
