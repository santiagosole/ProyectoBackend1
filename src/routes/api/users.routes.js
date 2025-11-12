import { Router } from "express";
import User from "../../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// 🟩 REGISTRO DE USUARIO
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.redirect("/users/register?error=Todos los campos son obligatorios");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect("/users/register?error=El usuario ya existe");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    // ✅ Redirige al login con mensaje de bienvenida
    res.redirect(
      `/users/login?success=Usuario creado correctamente&name=${encodeURIComponent(newUser.first_name)}`
    );
  } catch (error) {
    console.error("Error en /register:", error);
    res.redirect("/users/register?error=Error al registrar usuario");
  }
});

// 🟩 LOGIN DE USUARIO
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect("/users/login?error=Usuario no encontrado");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect("/users/login?error=Contraseña incorrecta");
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Guardar cookie firmada
    res.cookie("currentUser", token, {
      httpOnly: true,
      signed: true,
      maxAge: 60 * 60 * 1000,
    });

    // Redirige al perfil o página principal
    res.redirect("/users/current");
  } catch (error) {
    console.error("Error en /login:", error);
    res.redirect("/users/login?error=Error interno del servidor");
  }
});

// 🟩 LOGOUT
router.get("/logout", (req, res) => {
  res.clearCookie("currentUser");
  res.redirect("/users/login?success=Sesión cerrada correctamente");
});

export default router;
