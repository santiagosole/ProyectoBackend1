import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Simulación de productos
let products = [
  { id: 1, title: "Producto A", price: 125 },
  { id: 2, title: "Producto B", price: 135 },
  { id: 3, title: "Producto C", price: 145 }
];

// Rutas
app.get("/", (req, res) => {
  res.render("home", { products });
});

app.get("/products", (req, res) => {
  res.render("products/products", { products });
});


app.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts", { products });
});

// Server
const server = app.listen(PORT, () =>
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
);

// WebSockets
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado");

  // Enviar productos iniciales
  socket.emit("updateProducts", products);

  // Agregar producto
  socket.on("addProduct", (product) => {
    const newProduct = {
      id: products.length + 1,
      ...product
    };
    products.push(newProduct);
    io.emit("updateProducts", products);
  });

  // Eliminar producto
  socket.on("deleteProduct", (id) => {
    products = products.filter((p) => p.id !== id);
    io.emit("updateProducts", products);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});
