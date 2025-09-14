import { Router } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = Router();

// Agregar producto al carrito (o aumentar cantidad si ya existe)
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    const product = await Product.findById(req.params.pid);
    if(!cart || !product) return res.status(404).json({ error: "Carrito o producto no encontrado" });

    const existing = cart.products.find(p => p.product.toString() === product._id.toString());
    if(existing) existing.quantity += 1;
    else cart.products.push({ product: product._id, quantity: 1 });

    await cart.save();
    await cart.populate("products.product");
    res.status(200).json(cart);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// Incrementar cantidad de un producto
router.post("/:cid/product/:pid/increment", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if(!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const item = cart.products.find(p => p.product.toString() === req.params.pid);
    if(item) item.quantity += 1;

    await cart.save();
    await cart.populate("products.product");
    res.json(cart);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// Disminuir cantidad de un producto
router.post("/:cid/product/:pid/decrement", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if(!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const itemIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
    if(itemIndex > -1){
      cart.products[itemIndex].quantity -= 1;
      if(cart.products[itemIndex].quantity <= 0) cart.products.splice(itemIndex, 1);
    }

    await cart.save();
    await cart.populate("products.product");
    res.json(cart);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// Obtener carrito completo
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product");
    if(!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch(err) { res.status(500).json({ error: err.message }); }
});

export default router;
