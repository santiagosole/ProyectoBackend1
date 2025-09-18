import { Router } from "express";
import Cart from "../models/Cart.js";

const router = Router();

// Obtener carrito por ID
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product");
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar carrito completo (envío de cantidades desde el frontend)
router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body; // [{ productId, quantity }, ...]
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = products.map(p => ({ product: p.productId, quantity: p.quantity }));
    await cart.save();
    await cart.populate("products.product");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar cantidad de un producto específico
router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { quantity } = req.body; // cantidad nueva
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const itemIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.products.splice(itemIndex, 1); // eliminar si qty <= 0
      } else {
        cart.products[itemIndex].quantity = quantity;
      }
    } else if (quantity > 0) {
      cart.products.push({ product: req.params.pid, quantity });
    }

    await cart.save();
    await cart.populate("products.product");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
