const express = require("express");
const app = express();
const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const session = require('express-session');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
require("dotenv").config();
const cookieParser = require("cookie-parser");

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,

}));
app.use(express.json());
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// const mysql = require('mysql2/promise');

const menuRoute = require("./routes/menu");

app.use(menuRoute);

const ProductCategory = require("./models/productCategory");
const Product = require("./models/product");
const ProductVariant = require("./models/productVariant");
const User = require("./models/user");
const Order = require("./models/order");
const OrderItem = require("./models/order_item");

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(ProductVariant, { foreignKey: "productId", as: "size" });
ProductVariant.belongsTo(Product, { foreignKey: "productId" });

Product.belongsTo(ProductCategory, { foreignKey: 'categoryId', as: "category" });
ProductCategory.hasMany(Product, { foreignKey: 'categoryId' });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

ProductVariant.hasMany(OrderItem, { foreignKey: "variantId", as: "orderItems"});
OrderItem.belongsTo(ProductVariant, { foreignKey: "variantId", as: "variant"  });

Product.hasMany(OrderItem, { foreignKey: "smashburgerPanId" });
OrderItem.belongsTo(Product, { foreignKey: "smashburgerPanId", as: "smashburgerPan" });


sequelize.sync( { alter: true } )
  .then(async () => {
    /* console.log("All tables dropped and recreated successfully.");
    await seedProducts(); // Wait for the seeding process to complete */
     const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    const io = require('./socket').init(server);
    
    io.on('connection', socket => {
      console.log('Client connected')
    })
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });


  /* setInterval(async () => {
    try {
        const now = new Date();
        const currentTime = now.toTimeString().split(" ")[0]; // Get HH:MM:SS

        // Find all "preparing" orders
        const orders = await Order.findAll({ where: { status: "preparation" } });

        for (const order of orders) {
            const startTime = order.startTime;
            const prepTime = order.preparationTime;


            // Convert `startTime` to hours, minutes, and seconds
            const [startH, startM, startS] = startTime.split(":").map(Number);
            const [currentH, currentM, currentS] = currentTime.split(":").map(Number);

            // Handle minute overflow
            const totalMinutes = startM + prepTime;
            const extraHours = Math.floor(totalMinutes / 60);
            const adjustedMinutes = totalMinutes % 60; 

            // Convert to total seconds
            const endSeconds = (startH + extraHours +1) * 3600 + adjustedMinutes * 60 + startS;
            const currentSeconds = currentH * 3600 + currentM * 60 + currentS;

            if (currentSeconds >= endSeconds) {
                await Order.update({ status: "done" }, { where: { id: order.id } });
                io.emit("order-updated", { id: order.id, status: order.status });
                console.log(`Order ${order.id} marked as done.`);
            }
        }
    } catch (error) {
        console.error("Error updating order statuses:", error);
    }
}, 60000); // Runs every 1 minute */




    

  /* async function seedProducts() {
  try {
    await ProductCategory.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await ProductVariant.destroy({ where: {} });

    await ProductCategory.bulkCreate([
      { name: 'Burgers' },
      { name: 'Sauces' },
      { name: 'Drinks' },
      { name: 'Fries' },
      { name: 'Combo' },
      { name: 'Smashburger Pan' }
    ]);



    // Insert categories
    const burgerCategory = await ProductCategory.findOne({ where: { name: 'Burgers' } });
    const saucesCategory = await ProductCategory.findOne({ where: { name: 'Sauces' } });
    const drinksCategory = await ProductCategory.findOne({ where: { name: 'Drinks' } });
    const friesCategory = await ProductCategory.findOne({ where: { name: 'Fries' } });
    const comboCategory = await ProductCategory.findOne({ where: { name: 'Combo' } });
    const smashburgerpanCategory = await ProductCategory.findOne({ where: { name: 'Smashburger Pan' } });

    // Burgers
    const burgers = [
      { name: "Classic", basePrices: [11.9, 14.3, 16.7, 19.1, 21.5], ingredients: "Ketchup, mastard, onion, pickles" },
      { name: "Original", basePrices: [11.9, 14.3, 16.7, 19.1, 21.5], ingredients: "Ketchup, mastard, onion, iceberg salad" },
      { name: "Jalapeno", basePrices: [12.9, 15.3, 17.7, 20.1, 22.5], ingredients: "Hot ketchup, burger sauce, jalapeno, iceberg salad" },
      { name: "BBQ", basePrices: [12.9, 15.3, 17.7, 20.1, 22.5], ingredients: "BBQ sauce, dried meat, caramelized onion, pickles" }
    ];
    
    const sizes = ["Double", "Triple", "Double Double", "Triple Double", "Triple Triple"];

    for (let burger of burgers) {
      const product = await Product.create({
        name: burger.name,
        categoryId: burgerCategory.id,
        price: burger.basePrices[0], // Base price for smallest size
        ingredients: burger.ingredients
      });

      for (let i = 0; i < sizes.length; i++) {
        await ProductVariant.create({
          productId: product.id,
          size: sizes[i],
          price: burger.basePrices[i]
        });
      }
    }

    // Sauces
    const sauces = ["Ketchup", "Mayo", "BBQ", "Garlic", "Spicy Tomato Salsa"];
    for (let sauce of sauces) {
      await Product.create({
        name: sauce,
        categoryId: saucesCategory.id,
        price: 0.9
      });
    }

    // Drinks
    const drinks = ["Coca Cola", "Coca Cola Zero", "Fanta", "Voda", "Kisela voda", "Schweppes Bitter Lemon",
      "Schweppes Tonic", "Sprite", "Juice"
    ];
    for (let drink of drinks) {
      await Product.create({
        name: drink,
        categoryId: drinksCategory.id,
        price: 2.5
      });
    }
    
      await Product.create({
        name: "Fries",
        categoryId: friesCategory.id,
        price: 2.9
      });
    

    // Combos (Any Drink + Classic Fries)
    await Product.create({
      name: "Combo",
      categoryId: comboCategory.id,
      price: 4.5
    });

     // Smashburger Pan (Any Burger + Any Size)
    await Product.create({
      name: "Smashburger Pan",
      categoryId: smashburgerpanCategory.id,
      price: 2.9
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}  */

