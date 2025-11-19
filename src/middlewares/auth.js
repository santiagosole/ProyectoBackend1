import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.redirect("/users/login?error=Debes iniciar sesión");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return res.redirect("/users/login?error=Usuario no encontrado");
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Error en auth:", error);
    return res.redirect("/users/login?error=Sesión inválida o expirada");
  }
};