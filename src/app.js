import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";

// Config
import { initPassport } from "./config/passport.config.js";

// Rutas de vistas
import usersViewsRoutes from "./routes/views/users.views.js";
import productsViewsRoutes from "./routes/views/products.views.js";

// Rutas API
import usersApiRoutes from "./routes/api/users.routes.js";
import sessionsRoutes from "./routes/api/sessions.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js"; // <-- agregado

const app = express();

// Middlewares generales
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Passport
initPassport();
app.use(passport.initialize());

// Handlebars
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
app.use("/users", usersViewsRoutes);        // login/register/current
app.use("/products", productsViewsRoutes);  // vista de productos (handlebars)

// =============================
// RUTAS API / FUNCIONALES
// =============================
app.use("/api/users", usersApiRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/products", productsRouter);   // API separada para productos

// =============================
// RUTA DEL CARRITO (vistas y acciones)
// =============================
app.use("/cart", cartRoutes);               // <-- aquí está el carrito

// =============================
// RUTA RAÍZ
// =============================
app.get("/", (req, res) => {
  res.redirect("/users/login");
});

export default app;