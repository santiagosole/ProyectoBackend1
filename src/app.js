import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import handlebars from "express-handlebars";
import path from "path";
import mongoose from "mongoose";

import usersViewsRoutes from "./routes/views/users.views.js";
import usersApiRoutes from "./routes/api/users.routes.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve("src/views"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error en conexión:", err));

app.use("/users", usersViewsRoutes);
app.use("/api/users", usersApiRoutes);

app.get("/", (req, res) => {
  res.redirect("/users/login");
});

export default app;