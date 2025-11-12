import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.model.js";

const router = Router();

//  Registro de usuario
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Verificar si ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render("auth/register", {
        error: "⚠️ El usuario ya existe, por favor iniciá sesión."
      });
    }

    // Crear usuario
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword
    });
    await newUser.save();

    //  Mostrar alert y redirigir al login
    res.render("auth/registerSuccess", {
      first_name: newUser.first_name
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).render("auth/register", {
      error: "❌ Ocurrió un error al registrar el usuario."
    });
  }
});

// 🔑 Login de usuario
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Usuario no encontrado." });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta." });

    // Crear token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Guardar token en cookie
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

    // Redirigir a productos
    return res.redirect("/products");
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

// 👤 Obtener usuario actual
router.get("/current", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "No autenticado." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    res.json(user);
  } catch (error) {
    console.error("❌ Error en /current:", error);
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
});

export default router;
