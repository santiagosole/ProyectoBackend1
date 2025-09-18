import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { connectDB } from './config/db.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { getProductsView } from "./controllers/products.controller.js";
import { getCartView } from "./controllers/carts.controller.js";
import Product from "./models/Product.js";
import Cart from "./models/Cart.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public"))); 

// Handlebars con layout y helpers
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    helpers: {
      ifEquals: (a, b, options) => a === b ? options.fn(this) : options.inverse(this),
      multiply: (a, b) => a * b,
      calculateTotal: (products) => {
        return products.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      }
    }
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Conexión a MongoDB
connectDB();

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Vistas
app.get("/", getProductsView);
app.get("/products", getProductsView);
app.get("/carts/:cid", getCartView);

// Real Time Products
app.get("/realTimeProducts", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("realTimeProducts", { products });
  } catch (err) {
    res.status(500).send("Error al cargar productos");
  }
});

// Servidor
const server = app.listen(PORT, () =>
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
);

// WebSockets
const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("🟢 Cliente conectado");

  const products = await Product.find().lean(); 
  socket.emit("updateProducts", products);

  socket.on("addProduct", async (productData) => {
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      const products = await Product.find().lean();
      io.emit("updateProducts", products);
    } catch (err) {
      socket.emit("error", err.message);
    }
  });

  socket.on("deleteProduct", async (id) => {
    try {
      await Product.findByIdAndDelete(id);
      const products = await Product.find().lean();
      io.emit("updateProducts", products);
    } catch (err) {
      socket.emit("error", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});
