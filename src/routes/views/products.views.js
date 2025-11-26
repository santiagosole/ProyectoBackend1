import { Router } from "express";
import Product from "../../models/Product.js";
import { auth } from "../../middlewares/auth.js";

const router = Router();

// Vista de productos (protegidísima)
router.get("/", auth, async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("products/products", { products });
  } catch (error) {
    console.error("Error cargando productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;