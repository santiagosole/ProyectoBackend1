import { Router } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import jwt from "jsonwebtoken";

const router = Router();

// =============================
// MIDDLEWARE: verificar sesión usuario
// =============================
function authCart(req, res, next) {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      console.log("❌ No hay cookie jwt");
      return res.redirect("/users/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🔐 Usuario autenticado:", decoded);

    req.userId = decoded.id;

    next();
  } catch (err) {
    console.log("❌ Error verificando token:", err.message);
    res.clearCookie("jwt");
    return res.redirect("/users/login");
  }
}

// =========================
// AGREGAR PRODUCTO AL CARRITO
// =========================
router.post("/add/:pid", authCart, async (req, res) => {
  const userId = req.userId;
  const productId = req.params.pid;

  let cart = await Cart.findById(userId);

  if (!cart) {
    console.log("🛒 Carrito no existe, creando nuevo...");
    cart = await Cart.create({ _id: userId, products: [] });
  }

  const item = cart.products.find(
    (p) => p.productId.toString() === productId
  );

  if (item) {
    item.quantity++;
  } else {
    cart.products.push({ productId, quantity: 1 });
  }

  await cart.save();

  console.log("✔ Producto agregado al carrito");

  res.redirect("/products");
});

// =========================
// VER CARRITO
// =========================
router.get("/", authCart, async (req, res) => {
  const userId = req.userId;

  let cart = await Cart.findById(userId).populate("products.productId");

  // 🔥 SOLUCIÓN: si no existe el carrito, lo creamos vacío
  if (!cart) {
    cart = { products: [] };
  }

  res.render("cart/cart", { cart });
});

// =========================
// VACIAR CARRITO
// =========================
router.post("/clear", authCart, async (req, res) => {
  const userId = req.userId;

  await Cart.findByIdAndUpdate(
    userId,
    { products: [] },
    { new: true, upsert: true } // <-- asegura que exista el carrito
  );

  res.redirect("/cart");
});

export default router;