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
app.use(express.static(path.join(__dirname, "../public"))); 

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Simulación de productos
let products = [
  { id: 1, title: "Notebook Gamer", price: 1200, description: "Potente notebook para gaming", thumbnail: "", stock: 5, category: "Electrónica" },
  { id: 2, title: "Teclado Mecánico RGB", price: 150, description: "Teclado mecánico con luces RGB", thumbnail: "", stock: 10, category: "Periféricos" },
  { id: 3, title: "Mouse Inalámbrico", price: 75, description: "Mouse inalámbrico ergonómico", thumbnail: "", stock: 15, category: "Periféricos" },
  { id: 4, title: "Auriculares Gaming", price: 100, description: "Auriculares con micrófono y sonido envolvente", thumbnail: "", stock: 7, category: "Audio" },
  { id: 5, title: 'Monitor 27" 144Hz', price: 350, description: "Monitor con alta tasa de refresco", thumbnail: "", stock: 4, category: "Monitores" }
];

// Rutas
app.get("/", (req, res) => {
  res.render("home", { products });
});

// Productos
app.get("/products", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3; 
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedProducts = products.slice(startIndex, endIndex);

  res.render("products/products", {
    products: paginatedProducts,
    currentPage: page,
    hasNextPage: endIndex < products.length,
    hasPrevPage: startIndex > 0,
    nextPage: page + 1,
    prevPage: page - 1
  });
});

// Real Time Products
app.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", { products });
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
