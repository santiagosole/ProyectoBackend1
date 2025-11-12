import express from "express";
import Product from "../models/Product.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const products = await Product.find().lean();
  res.render("products/products", { products }); 
});

export default router;
