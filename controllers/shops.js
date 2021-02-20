const Product = require("../models/product");

exports.getProductsPage = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("customers/products-list", {
        prods: products,
        docTitle: "Mis Productos",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDetailsPage = (req, res, next) => {
  // obtengo el id del producto desde la ruta
  const prodID = req.params.productId;
  Product.findByPk(prodID)
    .then((product) => {
      res.render("customers/product-details", {
        // when destructuring, then returns an array, so I get its first element that contains my single product data
        product: product,
        docTitle: `Detalles ${product.titulo}`,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getHomePage = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("customers/index", {
        docTitle: "Home Page Tienda Online",
        path: "/",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCartPage = (req, res, next) => {
  // console.log(req.user.cart);
  req.user
    .getCarro()
    .then((cart) => {
      // console.log(cart);
      return cart
        .getProductos()
        .then((cartProds) => {
          // console.log(prods);
          res.render("customers/cart", {
            docTitle: "Pagina del carro",
            path: "/cart",
            products: cartProds,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddToCart = (req, res, next) => {
  const prodId = req.body.idProducto;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCarro()
    .then((cart) => {
      fetchedCart = cart;
      // ver si el prod ya esta en el cart
      return cart.getProductos({
        where: {
          id: prodId,
        },
      });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        // si esta en el carro aumento cantidad
        const oldQuantity = product.ItemsCarro.cantidad;
        newQuantity = oldQuantity + 1;
        return product;
      }
      // si no esta en el carro lo agrego
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProducto(product, {
        through: { cantidad: newQuantity },
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteCartItem = (req, res, next) => {
  const prodId = req.body.idCartItem;
  req.user
    .getCarro()
    .then((cart) => {
      return cart.getProductos({
        where: {
          id: prodId,
        },
      });
    })
    .then((products) => {
      const product = products[0];
      return product.ItemsCarro.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrdersPage = (req, res, next) => {
  res.render("customers/orders", {
    docTitle: "Pagina de tus pedidos",
    path: "/orders",
  });
};

exports.postAddOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCarro()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProductos();
    })
    .then((products) => {
      return req.user
        .createPedido()
        .then((order) => {
          return order.addProductos(
            products.map((product) => {
              product.itemsPedido = { cantidad: product.ItemsCarro.cantidad };
              return product;
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then((result) => {
      return fetchedCart.setProductos(null);
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCheckoutPage = (req, res, next) => {
  res.render("customers/checkout", {
    docTitle: "Pagina de checkout",
    path: "/checkout",
  });
};
