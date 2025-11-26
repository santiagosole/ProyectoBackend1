import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import productsViewsRoutes from "./routes/views/products.views.js";
import productsRouter from "./routes/products.routes.js";

// Config
import { initPassport } from "./config/passport.config.js";

// Rutas
import usersViewsRoutes from "./routes/views/users.views.js";
import usersApiRoutes from "./routes/api/users.routes.js";
import sessionsRoutes from "./routes/api/sessions.routes.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Inicializar Passport
initPassport();
app.use(passport.initialize());

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve("src/views"));

// Conexión a Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error en conexión:", err));

// Rutas
app.use("/users", usersViewsRoutes);
app.use("/api/users", usersApiRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/products", productsViewsRoutes);
app.use("/products", productsRouter);

app.get("/", (req, res) => {
  res.redirect("/users/login");
});

export default app;