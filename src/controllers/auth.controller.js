import bcrypt from "bcrypt";
import { UserModel } from "../models/User.js";

const ADMIN_EMAIL = "adminCoder@coder.com";
const ADMIN_PLAIN_PASS = "admin123"; // si querés cambiar, hacerlo aquí

export const getLogin = (req, res) => {
  if (req.session.user) return res.redirect("/products");
  res.render("login");
};

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.render("login", { error: "Usuario no encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render("login", { error: "Contraseña incorrecta" });

    // Guardar datos útiles en sesión (no guardar password)
    req.session.user = {
      id: user._id,
      name: user.first_name || user.email,
      email: user.email,
      role: user.role || "user"
    };

    return res.redirect("/products");
  } catch (err) {
    console.error(err);
    return res.render("login", { error: "Error en el servidor" });
  }
};

export const getRegister = (req, res) => {
  if (req.session.user) return res.redirect("/products");
  res.render("register");
};

export const postRegister = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const exists = await UserModel.findOne({ email });
    if (exists) return res.render("register", { error: "El email ya está registrado" });

    // Determinar rol: si coincide EXACTAMENTE con el combo admin, rol = admin
    let role = "user";
    if (email === ADMIN_EMAIL && password === ADMIN_PLAIN_PASS) {
      role = "admin";
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      first_name,
      last_name,
      email,
      password: hashed,
      role
    });

    await newUser.save();
    return res.redirect("/login");
  } catch (err) {
    console.error(err);
    return res.render("register", { error: "Error al registrar usuario" });
  }
};

export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error destruyendo sesión:", err);
      return res.redirect("/products");
    }
    res.clearCookie("connect.sid"); // nombre por defecto
    return res.redirect("/login");
  });
};
