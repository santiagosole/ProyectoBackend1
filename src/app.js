import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { connectDB } from './config/db.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import authRouter from './routes/auth.routes.js'; // rutas login/registro
import { getProductsView } from "./controllers/products.controller.js";
import { getCartView } from "./controllers/carts.controller.js";
import Product from "./models/Product.js";
import Cart from "./models/Cart.js";

import { sessionMiddleware } from "./config/session.js"; // sesiones
import passport from "passport";
import { initializePassport } from "./config/passport.js"; // Passport strategies

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// ===== Middlewares =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(sessionMiddleware); // habilita sesiones

// ===== Passport =====
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// ===== Handlebars =====
app.engine("handlebars", engine({
  defaultLayout: "main",
  helpers: {
    multiply: (a, b) => a * b
  }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// ===== Conectar DB =====
connectDB();

// ===== Rutas API =====
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// ===== Rutas autenticación =====
app.use("/", authRouter); // login, register, logout, GitHub

// ===== Rutas vistas =====
app.get("/", getProductsView);
app.get("/products", getProductsView);
app.get("/carts/:cid", getCartView);

app.get("/realTimeProducts", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("realTimeProducts", { products });
  } catch (err) {
    res.status(500).send("Error al cargar productos");
  }
});

// ===== Servidor y socket.io =====
const server = app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("Cliente WS conectado");
  const products = await Product.find().lean();
  socket.emit("updateProducts", products);
  socket.on("disconnect", () => console.log("Cliente WS desconectado"));
});
