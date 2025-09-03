import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { connectDB } from './config/db.js';
import productsRouter from './routes/products.routes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public"))); 

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Conexión a MongoDB
connectDB();

// Rutas API
app.use("/api/products", productsRouter);

// Vista home
app.get("/", async (req, res) => {
  try {
    const products = await productsRouter.stack[0].handle(); // alternativa: traer productos desde Product model
    res.render("home", { products });
  } catch (err) {
    res.status(500).send("Error al cargar productos");
  }
});

// Vista productos
app.get("/products", async (req, res) => {
  try {
    const Product = (await import("./models/Product.js")).default;
    const products = await Product.find();
    res.render("products/products", { products });
  } catch (err) {
    res.status(500).send("Error al cargar productos");
  }
});

// Real Time Products
app.get("/realTimeProducts", async (req, res) => {
  try {
    const Product = (await import("./models/Product.js")).default;
    const products = await Product.find();
    res.render("realTimeProducts", { products });
  } catch (err) {
    res.status(500).send("Error al cargar productos");
  }
});

// Server
const server = app.listen(PORT, () =>
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
);

// WebSockets
import Product from "./models/Product.js";
const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("🟢 Cliente conectado");

  // Enviar productos iniciales desde DB
  const products = await Product.find();
  socket.emit("updateProducts", products);

  // Agregar producto
  socket.on("addProduct", async (productData) => {
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      const products = await Product.find();
      io.emit("updateProducts", products);
    } catch (err) {
      socket.emit("error", err.message);
    }
  });

  // Eliminar producto
  socket.on("deleteProduct", async (id) => {
    try {
      await Product.findByIdAndDelete(id);
      const products = await Product.find();
      io.emit("updateProducts", products);
    } catch (err) {
      socket.emit("error", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});
