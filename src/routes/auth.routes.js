import { Router } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Usuarios "simulados" en memoria para este ejemplo
// Podés reemplazarlo por tu base de datos de usuarios real
const users = [];

// Ruta de registro
router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Verificar si el usuario ya existe
  const existingUser = users.find(u => u.email === email);
  if (existingUser) return res.status(400).send("Usuario ya registrado");

  // Encriptar contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Asignar rol: admin si es el correo predefinido, usuario si no
  const role = email === "adminCoder@coder.com" ? "admin" : "usuario";

  const newUser = { name, email, password: hashedPassword, role };
  users.push(newUser);

  req.session.user = {
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  };

  res.redirect("/products"); // redirige a productos luego de registro
});

// Ruta de login
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).send("Usuario no encontrado");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Contraseña incorrecta");

  req.session.user = {
    name: user.name,
    email: user.email,
    role: user.role
  };

  res.redirect("/products"); // redirige a productos luego de login
});

// Ruta de logout
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send("Error al cerrar sesión");
    res.redirect("/login");
  });
});

export default router;
