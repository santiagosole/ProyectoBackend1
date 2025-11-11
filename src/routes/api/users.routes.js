import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser(process.env.JWT_SECRET));

// ✅ Registro de usuario
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.redirect("/users/register?error=El usuario ya existe");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    console.log("✅ Usuario creado:", newUser.email);
    // 🔹 En lugar de devolver JSON, redirigimos al login
    res.redirect("/users/login?success=Usuario creado correctamente");
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    res.redirect("/users/register?error=Error al registrar usuario");
  }
});

// ✅ Login de usuario
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.redirect("/users/login?error=Usuario no encontrado");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.redirect("/users/login?error=Contraseña incorrecta");

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("currentUser", token, {
      httpOnly: true,
      signed: true,
    });

    res.redirect("/users/current");
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.redirect("/users/login?error=Error al iniciar sesión");
  }
});

// ✅ Logout
router.get("/logout", (req, res) => {
  res.clearCookie("currentUser");
  res.redirect("/users/login?success=Sesión cerrada correctamente");
});

export default router;
