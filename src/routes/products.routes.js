import { Router } from "express";
import { getProductsView } from "../controllers/products.controller.js";

const router = Router();

// Ruta para obtener todos los productos
router.get("/", getProductsView);

export default router;
