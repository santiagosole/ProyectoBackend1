import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Cart from "../models/Cart.js";

const router = Router();

// =========================
// MIDDLEWARE: AUTH CARRITO
// =========================
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

// =========================
// AGREGAR AL CARRITO
// =========================
router.post("/add/:pid", authCart, async (req, res) => {
  const user = await User.findById(req.userId);
  const productId = req.params.pid;

  // Busca el carrito del usuario
  let cart = await Cart.findById(user.cart);

  // Busca si ese producto ya está en el carrito
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

// =========================
// VER CARRITO
// =========================
router.get("/", authCart, async (req, res) => {
  const user = await User.findById(req.userId).populate({
    path: "cart",
    populate: { path: "products.productId" }
  });

  // ⚠️ Mongoose document -> objeto plano para Handlebars
  const cart = user.cart.toObject();

  res.render("cart/cart", { cart });
});

// =========================
// VACIAR CARRITO
// =========================
router.post("/clear", authCart, async (req, res) => {
  const user = await User.findById(req.userId);

  await Cart.findByIdAndUpdate(user.cart, { products: [] });

  res.redirect("/cart");
});

// =========================
// EXPORTACIÓN
// =========================
export default router;