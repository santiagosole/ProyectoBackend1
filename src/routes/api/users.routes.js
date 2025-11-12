import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.model.js"; // ojo, minúscula según tu archivo
import cookieParser from "cookie-parser";

const router = express.Router();
router.use(cookieParser(process.env.JWT_SECRET));

// ✅ Registro de usuario
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).send({ error: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    res.status(201).send({
      message: `¡Bienvenido ${first_name}! Gracias por confiar en nosotros. Ahora podés iniciar sesión.`,
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error al registrar usuario" });
  }
});

// ✅ Login de usuario
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.redirect("/users/login?error=Credenciales inválidas");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.redirect("/users/login?error=Credenciales inválidas");

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("currentUser", token, {
      httpOnly: true,
      signed: true,
    });

    // 🔁 Redirige a productos directamente al iniciar sesión
    res.redirect("/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en el login");
  }
});

// ✅ Logout
router.get("/logout", (req, res) => {
  res.clearCookie("currentUser");
  res.redirect("/users/login");
});

export default router;
