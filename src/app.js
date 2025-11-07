import express from "express";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";

// 🧭 Routers principales
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import usersApiRouter from "./routes/api/users.routes.js";
import usersViewsRouter from "./routes/views/users.views.js";

dotenv.config();

// =================== 🔧 Configuración base ===================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// =================== 🔧 Middlewares globales ===================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET)); // Firma las cookies
app.use(express.static(path.join(__dirname, "../public")));

// =================== 🎨 Handlebars ===================
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// =================== 🧠 Conexión MongoDB ===================
connectDB();

// =================== 🧭 Rutas API ===================
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersApiRouter); // Registro, login, logout

// =================== 🧭 Rutas de vistas ===================
app.use("/users", usersViewsRouter); // /login, /register, /current

// =================== 🌐 Redirecciones simples ===================
// Permite acceder también a /login y /register directamente
app.get("/login", (req, res) => res.redirect("/users/login"));
app.get("/register", (req, res) => res.redirect("/users/register"));

// =================== 🏠 Página raíz ===================
app.get("/", (req, res) => res.redirect("/users/login"));

// =================== 🚀 Servidor ===================
app.listen(PORT, () =>
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
);
