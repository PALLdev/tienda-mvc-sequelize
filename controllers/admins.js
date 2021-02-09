const Product = require("../models/product");

exports.getAdminProductsPage = (req, res, next) => {
  Product.fetchAll((allProducts) => {
    res.render("admin/products", {
      docTitle: "Administrar productos",
      path: "/admin/products",
      prods: allProducts,
    });
  });
};

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Formulario",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  // los obtengo con el name HTML
  const title = req.body.titulo;
  const imgURL = req.body.urlImagen;
  const price = req.body.precio;
  const description = req.body.descripcion;

  const product = new Product(null, title, imgURL, description, price);
  product.save();
  res.redirect("/");
};

exports.getEditProductPage = (req, res, next) => {
  const editMode = req.query.edit;
  // redundant if check ya que siempre que entre aqui sera en edit mode
  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (!product) {
      // si no encuentro el producto redirecciono, aunque deberia mostrar un mensaje de error
      return res.redirect("/");
    }
    // si encuentro el producto lo mando al view
    res.render("admin/edit-product", {
      docTitle: "Editar producto",
      path: "/admin/edit-product",
      editing: true,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.titulo;
  const updatedImgUrl = req.body.urlImagen;
  const updatedPrice = req.body.precio;
  const updatedDescription = req.body.descripcion;

  const updatedProd = new Product(
    prodId,
    updatedTitle,
    updatedImgUrl,
    updatedDescription,
    updatedPrice
  );
  updatedProd.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.idProducto;
  Product.deleteById(prodId);
  res.redirect("/admin/products");
};
