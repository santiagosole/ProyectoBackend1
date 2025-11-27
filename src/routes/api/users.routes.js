import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.model.js";
import Cart from "../../models/Cart.js";

const router = Router();

// ==========================
// REGISTRO
// ==========================
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.render("auth/register", {
        error: "⚠️ Ya existe un usuario con ese email."
      });

    const hashed = bcrypt.hashSync(password, 10);

    const newCart = await Cart.create({ products: [] });

    const user = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: hashed,
      cart: newCart._id
    });

    res.render("auth/registerSuccess", {
      first_name: user.first_name
    });
  } catch (err) {
    console.log(err);
    res.render("auth/register", { error: "Error en el registro." });
  }
});

// ==========================
// LOGIN
// ==========================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.render("auth/login", { error: "Usuario no encontrado." });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid)
    return res.render("auth/login", { error: "Contraseña incorrecta." });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("jwt", token, { httpOnly: true });

  return res.redirect("/users/current");
});

// ==========================
// LOGOUT
// ==========================
router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/users/login");
});

export default router;