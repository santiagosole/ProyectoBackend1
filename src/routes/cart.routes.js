import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Cart from "../models/Cart.js";

const router = Router();

function authCart(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.redirect("/users/login");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.clearCookie("jwt");
    return res.redirect("/users/login");
  }
}

router.post("/add/:pid", authCart, async (req, res) => {
  const user = await User.findById(req.userId);
  const productId = req.params.pid;

  let cart = await Cart.findById(user.cart);

  const item = cart.products.find(
    p => p.productId.toString() === productId
  );

  if (item) {
    item.quantity++;
  } else {
    cart.products.push({ productId, quantity: 1 });
  }

  await cart.save();
  res.redirect("/products");
});

router.get("/", authCart, async (req, res) => {
  const user = await User.findById(req.userId).populate({
    path: "cart",
    populate: { path: "products.productId" }
  });

  const cart = user.cart.toObject();
  res.render("cart/cart", { cart });
});

// Actualizar cantidad de producto en el carrito
router.post("/update/:pid", authCart, async (req, res) => {
  const user = await User.findById(req.userId);
  const productId = req.params.pid;
  const { quantity } = req.body; // Cantidad a actualizar

  let cart = await Cart.findById(user.cart);

  const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);

  if (itemIndex !== -1) {
    if (quantity > 0) {
      cart.products[itemIndex].quantity = quantity;
    } else {
      // Si la cantidad es 0 o menos, eliminar el producto
      cart.products.splice(itemIndex, 1);
    }
  }
  
  await cart.save();
  res.redirect("/cart");
});

// Eliminar producto del carrito
router.post("/remove/:pid", authCart, async (req, res) => {
  const user = await User.findById(req.userId);
  const productId = req.params.pid;

  let cart = await Cart.findById(user.cart);

  cart.products = cart.products.filter(p => p.productId.toString() !== productId);
  
  await cart.save();
  res.redirect("/cart");
});

router.post("/clear", authCart, async (req, res) => {
  const user = await User.findById(req.userId);
  await Cart.findByIdAndUpdate(user.cart, { products: [] });
  res.redirect("/cart");
});

router.post("/purchase", authCart, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    let cart = await Cart.findById(user.cart).populate("products.productId");

    if (!cart || cart.products.length === 0) {
      return res.status(400).send("El carrito está vacío.");
    }

    // Lógica para procesar la compra (generar ticket, restar stock, etc.)
    const purchaseCode = `ORD-${Date.now()}`;
    const totalAmount = cart.products.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);

    // Aquí se debería generar un Ticket en la base de datos
    // Y actualizar el stock de los productos
    // Por simplicidad, solo generamos un resumen

    await Cart.findByIdAndUpdate(user.cart, { products: [] }); // Vaciar el carrito

    res.render("purchase/summary", { purchaseCode, totalAmount, products: cart.products });
  } catch (error) {
    console.error("Error al finalizar la compra:", error);
    res.status(500).send("Error interno del servidor al procesar la compra.");
  }
});

export default router;
