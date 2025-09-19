import { Router } from "express";
import Cart from "../models/Cart.js";

const router = Router();

// GET cart
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product");
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add product (one-by-one) - used by add-to-cart button
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const existing = cart.products.find(p => p.product.toString() === pid);
    if (existing) existing.quantity += 1;
    else cart.products.push({ product: pid, quantity: 1 });

    await cart.save();
    await cart.populate("products.product");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update whole cart (used by "Actualizar carrito" button)
router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body; // [{ productId, quantity }]
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = (products || []).map(p => ({ product: p.productId, quantity: p.quantity }));
    await cart.save();
    await cart.populate("products.product");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE empty cart
router.delete("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();
    res.json({ message: "Carrito vaciado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE producto individual
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
    await cart.save();
    await cart.populate("products.product");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;