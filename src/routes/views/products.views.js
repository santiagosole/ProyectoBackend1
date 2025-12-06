
import { Router } from "express";
import ProductsRepository from "../../repositories/products.repository.js";
import { auth } from "../../middlewares/auth.js";

const router = Router();
const productsRepository = new ProductsRepository();

// Vista de productos (protegida)
router.get("/", auth, async (req, res) => {
  try {
    const products = await productsRepository.getAllProducts();
    res.render("products/products", { products });
  } catch (error) {
    console.error("Error cargando productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;