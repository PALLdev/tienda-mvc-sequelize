const path = require("path");
const express = require("express");
const parser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorsController = require("./controllers/errors");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();
const port = 3000;

// middleware que se aplicara en todas las request (ya que esta arriba y tiene next() )
// app.use('/', (req, res, next) => {
//     console.log('Me ejecutaré siempre middleware');
//     next();
// });
// solo necesito esta linea si uso HANDLEBARS
// app.engine('hbs', expressHDBS({ layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs' })); // layoutsDir por defecto es el mismo valor que puse, si no defino una extension la por defecto sera .handlebars

app.set("view engine", "ejs"); // definiendo el template engine
app.set("views", "views"); // definiendo donde estan mis views

app.use(parser.urlencoded({ extended: false }));
// dando acceso a mi carpeta public (read only)
app.use(express.static(path.join(__dirname, "public")));

// PASANDO USER AL REQUEST (user creado manualmente)
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.error404Page);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" }); //user created products
User.hasMany(Product, { as: "Producto" });

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    // creando user manualmente
    return User.findByPk(1)
      .then((user) => {
        if (!user) {
          return User.create({ nombre: "admin", email: "admin@test.com" });
        } else {
          return user;
        }
      })
      .then((user) => {
        return user.createCarro();
      })
      .then(() => {
        app.listen(port, () => {
          console.log(`Server running on localhost:${port}`);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });
