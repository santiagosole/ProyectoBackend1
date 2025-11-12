import express from "express";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// 📦 Rutas
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import usersApiRouter from "./routes/api/users.routes.js";
import usersViewsRouter from "./routes/views/users.views.js";

dotenv.config();

// 🧭 Config rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// 🧩 Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static(path.join(__dirname, "../public")));

// 🎨 Configuración de Handlebars
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// 🔗 Conexión a MongoDB
connectDB();

// 🚦 Rutas principales
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersApiRouter);
app.use("/users", usersViewsRouter);
app.use("/products", productsRouter);

// 🏠 Página raíz → redirige a login
app.get("/", (req, res) => res.redirect("/users/login"));

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor funcionando en http://localhost:${PORT}`);
});
