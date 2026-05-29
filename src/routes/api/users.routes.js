import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.model.js";
import Cart from "../../models/Cart.js";

const router = Router();

// ==========================
// REGISTRO
// ==========================
/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario en la plataforma
 *     description: Permite registrar un usuario nuevo en el sistema con un carrito asociado.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegisterInput'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/UserRegisterInput'
 *     responses:
 *       200:
 *         description: Registro exitoso, renderiza la vista de éxito.
 *       400:
 *         description: Entrada inválida o email ya registrado.
 *       500:
 *         description: Error interno del servidor.
 */
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
/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión de un usuario
 *     description: Autentica un usuario mediante su correo electrónico y contraseña, emitiendo una cookie JWT.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginInput'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginInput'
 *     responses:
 *       200:
 *         description: Autenticación exitosa y redirección a la vista de usuario actual.
 *       401:
 *         description: Contraseña incorrecta o usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
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
/**
 * @openapi
 * /api/users/logout:
 *   post:
 *     summary: Cerrar sesión del usuario actual
 *     description: Limpia la cookie JWT del navegador y redirige a la vista de login.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Cierre de sesión exitoso y redirección.
 */
router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/users/login");
});

export default router;