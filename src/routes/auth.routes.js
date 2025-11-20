import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/User.js";

const router = Router();

// =========================
// REGISTER
// =========================
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password, age } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Usuario ya existe" });

    const hashed = bcrypt.hashSync(password, 10);

    const role = email === "adminCoder@coder.com" ? "admin" : "user";

    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: hashed,
      role,
    });

    res.status(201).json({ message: "Usuario creado", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// LOGIN (JWT)
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Credenciales inválidas" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(400).json({ error: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWTSecret,
      { expiresIn: "24h" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// CURRENT (JWT protected)
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