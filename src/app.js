import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import { initPassport } from "./config/passport.config.js";
import { currentUser } from "./middlewares/currentUser.js";

import usersViewsRoutes from "./routes/views/users.views.js";
import productsViewsRoutes from "./routes/views/products.views.js";

import usersApiRoutes from "./routes/api/users.routes.js";
import sessionsRoutes from "./routes/api/sessions.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import adoptionRouter from "./routes/adoption.router.js";

const app = express();

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(currentUser);

// Passport 
initPassport();
app.use(passport.initialize());


app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve("src/views"));

// Conexion base de datos 
const mongoUri = process.env.MONGO_URI?.trim();
if (!mongoUri) {
  console.error(
    "Falta MONGO_URI en .env (URI de Atlas: Database → Connect → Drivers)."
  );
  process.exit(1);
}
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Error en conexión:", err));

// rutas
app.use("/users", usersViewsRoutes);
app.use("/products", productsViewsRoutes);
app.use("/api/users", usersApiRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/products", productsRouter);
app.use("/api/adoptions", adoptionRouter);
app.use("/cart", cartRoutes);

// API documentacion
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación de la API de Adopción",
      version: "1.0.0",
      description: "API para gestionar usuarios, productos y carritos en un ecommerce.",
    },
  },
  apis: ["./backend-preentrega/src/docs/**/*.yaml"],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Root route
app.get("/", (req, res) => {
  res.redirect("/users/login");
});

export default app;
