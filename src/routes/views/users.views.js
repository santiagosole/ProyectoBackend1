import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🧩 Página de login
router.get("/login", (req, res) => {
  const { error } = req.query;
  res.render("auth/login", { error });
});

// 🧩 Página de registro
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// 🧩 Página de usuario actual (requiere cookie válida)
router.get("/current", (req, res) => {
  const token = req.signedCookies.currentUser;

  if (!token) return res.redirect("/users/login");

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET);
    res.render("users/current", userData);
  } catch (error) {
    console.error("Error verificando token:", error);
    res.redirect("/users/login");
  }
});

export default router;
