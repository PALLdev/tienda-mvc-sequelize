const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProductsPage = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("customers/products-list", {
        prods: rows,
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
  Product.findById(prodID, (product) => {
    res.render("customers/product-details", {
      product: product,
      docTitle: `Detalles ${product.titulo}`,
      path: "/products",
    });
  });
};

exports.getHomePage = (req, res, next) => {
  Product.fetchAll()
    // rows are all my entries in the productos table
    .then(([rows, fieldData]) => {
      res.render("customers/index", {
        docTitle: "Home Page Tienda Online",
        path: "/",
        prods: rows,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCartPage = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProds = [];
      // filter the products that are in the cart
      // si el prod que estoy buscando es parte del cart, lo agrego a mi nueva lista de prods
      // si no tenemos prods en el cart, se mandara un empty array
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProds.push({
            productData: product,
            quantity: cartProductData.quantity,
          });
        }
      }
      res.render("customers/cart", {
        docTitle: "Pagina del carro",
        path: "/cart",
        products: cartProds,
      });
    });
  });
};

exports.postAddToCart = (req, res, next) => {
  const prodId = req.body.idProducto;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.precio);
  });

  res.redirect("/cart");
};

exports.postDeleteCartItem = (req, res, next) => {
  const prodId = req.body.idCartItem;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.precio);
    res.redirect("/cart");
  });
};

exports.getOrdersPage = (req, res, next) => {
  res.render("customers/orders", {
    docTitle: "Pagina de tus pedidos",
    path: "/orders",
  });
};

exports.getCheckoutPage = (req, res, next) => {
  res.render("customers/checkout", {
    docTitle: "Pagina de checkout",
    path: "/checkout",
  });
};
