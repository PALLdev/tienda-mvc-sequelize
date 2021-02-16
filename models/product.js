const { DataTypes, Model } = require("sequelize");

const sequelize = require("../util/database");

class Product extends Model {}

Product.init(
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    urlImagen: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "productos", // We need to choose the model name
  }
);

module.exports = Product;
