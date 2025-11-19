import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.model.js";

const router = Router();

// ==========================
// REGISTRO
// ==========================
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.render("auth/register", {
        error: "⚠️ Ya existe un usuario con ese email."
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword
    });

    await newUser.save();

    res.render("auth/registerSuccess", {
      first_name: newUser.first_name
    });

  } catch (error) {
    console.error(error);
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
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

  return res.redirect("/users/current");
});

// ==========================
// LOGOUT
// ==========================
router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  return res.redirect("/users/login");
});

export default router;