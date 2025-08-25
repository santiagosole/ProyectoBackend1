import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Datos iniciales
let products = [
  { id: 1, name: "Notebook Gamer", price: 1200 },
  { id: 2, name: "Teclado Mecánico RGB", price: 150 },
  { id: 3, name: "Mouse Inalámbrico", price: 75 },
  { id: 4, name: "Auriculares Gaming", price: 100 },
  { id: 5, name: "Monitor 27\" 144Hz", price: 350 },
];

// Configuración Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servidor HTTP y Socket.io
const server = http.createServer(app);
const io = new Server(server);

// Rutas
app.get("/", (req, res) => {
  res.render("home", { title: "Lista de productos en tiempo real", products });
});

app.get("/productos", (req, res) => {
  res.render("products/products", { title: "Lista de Productos", products });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts", { title: "Productos en tiempo real", products });
});

// Socket.io
io.on("connection", (socket) => {
  console.log("Cliente conectado");

  // Enviar lista inicial
  socket.emit("updateProducts", products);

  // Escuchar nuevo producto
  socket.on("newProduct", (product) => {
    const newId = products.length ? products[products.length - 1].id + 1 : 1;
    const newProduct = { id: newId, ...product };
    products.push(newProduct);

    io.emit("updateProducts", products);
  });
});

// Levantar servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
