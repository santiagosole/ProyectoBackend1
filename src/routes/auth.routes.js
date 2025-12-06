import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/User.js";

const router = Router();

// =========================
// REGISTER (crea carrito vacío)
// =========================
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password, age } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(400)
        .render("auth/register", { error: "El usuario ya existe" });

    const hashed = bcrypt.hashSync(password, 10);
    const role = email === "adminCoder@coder.com" ? "admin" : "user";

    // Crear usuario con carrito vacío
    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: hashed,
      role,
      cart: [] 
    });

    res.status(201).render("auth/registerSuccess", {
      message: "Usuario creado con éxito",
    });
  } catch (err) {
    res.status(500).render("auth/register", { error: err.message });
  }
});

// =========================
// LOGIN (JWT + COOKIE + REDIRECT)
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .render("auth/login", { error: "Credenciales inválidas" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid)
      return res
        .status(400)
        .render("auth/login", { error: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWTSecret,
      { expiresIn: "24h" }
    );

    // Guardar token en cookie
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Redirige a productos
    res.redirect("/products");
  } catch (err) {
    res.status(500).render("auth/login", { error: err.message });
  }
});

// =========================
// CURRENT (JWT protegido)
// =========================
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      message: "Usuario autenticado",
      user: req.user,
    });
  }
);

export default router;