import { Router } from "express";
import Product from "../models/Product.js";
import { getProductsView, getProductsAPI } from "../controllers/products.controller.js";

const router = Router();

// RUTA VISTA
router.get("/view", getProductsView);

// RUTAS API

// Obtener todos los productos con paginación, filtros y sort
router.get("/", getProductsAPI);

// Obtener producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

// Crear nuevo producto
router.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, status, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const newProduct = new Product({
      title,
      description,
      code,
      price,
      stock,
      category,
      status: status ?? true,
      thumbnail: thumbnails ?? []
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message || "Error al agregar producto" });
  }
});

// Actualizar producto
router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message || "Error al actualizar producto" });
  }
});

// Eliminar producto
router.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error al eliminar producto" });
  }
});

export default router;
