import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function currentUser(req, res, next) {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.locals.currentUser = null;
      return next();
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    res.locals.currentUser = {
      id: decoded.id,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      email: decoded.email,
      role: decoded.role
    };

  } catch (err) {
    res.locals.currentUser = null;
  }

  next();
}