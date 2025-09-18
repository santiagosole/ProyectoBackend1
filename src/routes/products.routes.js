import { Router } from "express";
import Product from "../models/Product.js";
import { getProductsView } from "../controllers/products.controller.js";

const router = Router();

router.get("/", async (req, res) => {
  // También dejamos la API simple si la usás en algún lado
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

export default router;
