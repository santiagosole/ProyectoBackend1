import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

// 🟦 Vista de registro
router.get("/register", (req, res) => {
  const { error, success, name } = req.query;
  res.render("auth/register", { error, success, successName: name });
});

// 🟦 Vista de login
router.get("/login", (req, res) => {
  const { error, success, name } = req.query;
  res.render("auth/login", { error, success, successName: name });
});

// 🟦 Vista de perfil del usuario logueado
router.get("/current", (req, res) => {
  const token = req.signedCookies?.currentUser;

  if (!token) {
    return res.redirect("/users/login?error=Debes iniciar sesión");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.render("auth/current", { user: decoded });
  } catch (err) {
    console.error("Error decodificando token:", err);
    res.redirect("/users/login?error=Sesión expirada, volvé a iniciar sesión");
  }
});

export default router;
