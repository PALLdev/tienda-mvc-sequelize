const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");
const Cart = require("./cart");

const p = path.join(rootDir, "data", "products.json");

// helper function
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, titulo, urlImagen, descripcion, precio) {
    this.id = id;
    this.titulo = titulo;
    this.urlImagen = urlImagen;
    this.descripcion = descripcion;
    this.precio = precio;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        //pasando un id unico al guardar el producto
        this.id = Math.random().toString();
        // agrego el producto a la lista
        products.push(this);
        // lo mando al archivo
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromFile((prods) => {
      const product = prods.find((prod) => prod.id === id);
      // filter retorna una nueva lista con los prods que cumplan la condicion
      // osea todos menos el que quiero borrar en este caso
      const updatedProducts = prods.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.precio);
        }
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      // find ejecuta una func por cada producto, si esta returns true (ids son iguales), obtengo ese producto en una variable
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
