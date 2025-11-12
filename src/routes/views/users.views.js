import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Render de login
router.get("/login", (req, res) => {
  const error = req.query.error || null;
  res.render("auth/login", { error });
});

// ✅ Render de registro
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// ✅ Vista actual del usuario logueado
router.get("/current", (req, res) => {
  try {
    const token = req.signedCookies.currentUser;
    if (!token) return res.redirect("/users/login");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.render("users/current", { user: decoded });
  } catch (error) {
    console.error("Token inválido o expirado:", error);
    res.redirect("/users/login");
  }
});

export default router;
