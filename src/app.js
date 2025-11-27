import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";

// Configuración Passport
import { initPassport } from "./config/passport.config.js";

// Middlewares
import { currentUser } from "./middlewares/currentUser.js";

// Rutas de vistas
import usersViewsRoutes from "./routes/views/users.views.js";
import productsViewsRoutes from "./routes/views/products.views.js";

// Rutas API
import usersApiRoutes from "./routes/api/users.routes.js";
import sessionsRoutes from "./routes/api/sessions.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js";

const app = express();

// =============================
// MIDDLEWARES GENERALES
// =============================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Middleware global para insertar currentUser en Handlebars
app.use(currentUser);

// =============================
// PASSPORT
// =============================
initPassport();
app.use(passport.initialize());

// =============================
// HANDLEBARS
// =============================
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve("src/views"));

// =============================
// CONEXIÓN A MONGO
// =============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Error en conexión:", err));

// =============================
// RUTAS DE VISTAS
// =============================
app.use("/users", usersViewsRoutes);
app.use("/products", productsViewsRoutes);

// =============================
// RUTAS API
// =============================
app.use("/api/users", usersApiRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/products", productsRouter);

// =============================
// RUTAS DEL CARRITO
// =============================
app.use("/cart", cartRoutes);

// =============================
// RUTA PRINCIPAL
// =============================
app.get("/", (req, res) => {
  res.redirect("/users/login");
});

export default app;