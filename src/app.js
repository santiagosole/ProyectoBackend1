import express from "express";
import { env } from "./config/env.js";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import { engine } from "express-handlebars";
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
import purchaseRoutes from "./routes/purchase.routes.js"; // Importa la nueva ruta de compra
import adoptionRouter from "./routes/adoption.router.js";

const app = express();

// Middlewares globales de Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(currentUser);

// Configuración de Passport para autenticación
initPassport();
app.use(passport.initialize());


app.engine("handlebars", engine({
  helpers: {
    multiply: (price, quantity) => (price * quantity).toFixed(2),
    calculateCartTotal: (products) => {
      let total = 0;
      products.forEach(item => {
        total += item.productId.price * item.quantity;
      });
      return total.toFixed(2);
    }
  },
// Configuración para que Handlebars pueda acceder a las propiedades y métodos de los objetos de Mongoose.
// Esto es útil porque Mongoose devuelve objetos que necesitan ser serializados para su uso en plantillas.
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set("view engine", "handlebars");
app.set("views", path.resolve("src/views"));

// Establece la conexión con la base de datos MongoDB.
// Si la URI de conexión no está presente en las variables de entorno, muestra un error y sale del proceso.
mongoose
  .connect(env.mongoUri)
  .then(() => console.log("Conexión exitosa a MongoDB."))
  .catch((err) => console.error("Error al conectar con MongoDB:", err));

// Define las rutas de la aplicación para organizar los diferentes endpoints.
app.use("/users", usersViewsRoutes);
app.use("/products", productsViewsRoutes);
app.use("/api/users", usersApiRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/products", productsRouter);
app.use("/api/adoptions", adoptionRouter);
app.use("/cart", cartRoutes);
app.use("/api/purchase", purchaseRoutes); // Ruta para gestionar las compras

// Configura Swagger para generar y servir la documentación de la API.
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

// Redirige al usuario a la página de inicio de sesión cuando accede a la ruta raíz.
app.get("/", (req, res) => {
  res.redirect("/users/login");
});

export default app;
