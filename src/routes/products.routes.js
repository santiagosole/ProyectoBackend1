import { Router } from "express";
import Product from "../models/Product.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/", auth, async (req, res) => {
  const products = await Product.find().lean();
  res.render("products/products", { products });
});

export default router;