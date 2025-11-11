import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🧭 Renderiza formulario de login
router.get("/login", (req, res) => {
  const { error, success } = req.query;
  res.render("auth/login", { error, success });
});

// 🧭 Renderiza formulario de registro
router.get("/register", (req, res) => {
  const { error } = req.query;
  res.render("auth/register", { error });
});

// 🧭 Renderiza la vista de usuario actual
router.get("/current", (req, res) => {
  try {
    const token = req.signedCookies.currentUser;
    if (!token) return res.redirect("/users/login?error=Sesión expirada");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.render("users/current", decoded);
  } catch (error) {
    console.error("Error en /current:", error);
    res.redirect("/users/login?error=Token inválido");
  }
});

export default router;
