const db = require("../util/database");
const Cart = require("./cart");

module.exports = class Product {
  constructor(id, titulo, urlImagen, descripcion, precio) {
    this.id = id;
    this.titulo = titulo;
    this.urlImagen = urlImagen;
    this.descripcion = descripcion;
    this.precio = precio;
  }

  save() {
    return db.execute(
      "INSERT INTO productos (titulo, precio, descripcion, urlImagen) VALUES (?, ?, ?, ?)",
      [this.titulo, this.precio, this.descripcion, this.urlImagen]
    );
  }

  static deleteById(id) {}

  static fetchAll() {
    return db.execute("SELECT * FROM productos");
  }

  static findById(id) {
    // retorna un array con un solo producto y sus propiedades
    return db.execute("SELECT * FROM productos WHERE productos.id = ?", [id]);
  }
};
