const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Obtener data del carro anterior
    // error means that i dont have a cart yet. (cart file is empty)
    // if I have an error I create my cart
    // if no error I have an existing cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analizar el carro => ver si ya existe el producto en el carro
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Agregar producto nuevo / incrementar cantidad
      if (existingProduct) {
        updatedProduct = { ...existingProduct }; // getting object with same properties of existing prod
        updatedProduct.quantity = updatedProduct.quantity + 1;
        cart.products = [...cart.products]; // obtengo los que tengo
        cart.products[existingProductIndex] = updatedProduct; // override this position in the list with my updatedProd
      } else {
        // si no estaba en el carro lo agrego (new object)
        updatedProduct = { id: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      // save cart back to the file
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const cart = JSON.parse(fileContent);
      const updatedCart = { ...cart };
      // find how many times we have the product on the cart to change total
      const product = updatedCart.products.find((prod) => prod.id === id);
      // check if a given product is part of the cart
      if (!product) {
        return;
      }
      const prodQuantity = product.quantity;
      // creo nueva lista sin el prod que quiero eliminar
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * prodQuantity;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
