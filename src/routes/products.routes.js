import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

// Middleware para proteger vistas (opcional, si querés restringir)
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user) return next();
  return res.redirect("/login");
};

// Rutas API
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const inserted = await Product.insertMany(req.body.products || []);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para vista de productos
router.get("/view", async (req, res) => {
  try {
    const products = await Product.find().lean();

    // si hay sesión activa, pasa info del usuario
    const user = req.session ? req.session.user : null;

    res.render("products/list", {
      products,
      user
    });
  } catch (err) {
    res.status(500).send("Error al cargar productos");
  }
});

export default router;
