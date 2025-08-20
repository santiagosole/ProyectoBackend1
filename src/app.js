import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import exphbs from "express-handlebars";

import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/carts.routes.js";

const app = express();
const PORT = 8080;

// Servidor HTTP + Socket.IO
const server = createServer(app);
const io = new Server(server);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "src/views"));

// ------------------ RUTAS ------------------

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// Ecommerce vistas y API
app.use("/products", productsRoutes);       // Handlebars /products/view
app.use("/api/products", productsRoutes);   // API JSON
app.use("/api/carts", cartsRoutes);

// Chat
app.get("/chat", (req, res) => {
  res.render("chat");
});

// ------------------ SOCKET.IO ------------------
io.on("connection", (socket) => {
  console.log("🟢 Nuevo cliente conectado");

  socket.on("message", (data) => {
    io.emit("messageLogs", data);
  });
});

// ------------------ LEVANTAR SERVER ------------------
server.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
