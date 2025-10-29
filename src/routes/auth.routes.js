
// src/routes/auth.routes.js
import { Router } from "express";
import passport from "passport";
import User from "../models/User.js";

const router = Router();

// Registro
router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post(
  "/register",
  async (req, res, next) => {
    const { first_name, last_name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).send("Usuario ya registrado");

      // Crear usuario en DB (la contraseña se hash en Passport local strategy)
      const role = email === "adminCoder@coder.com" ? "admin" : "user";

      const newUser = new User({ first_name, last_name, email, password, role });
      await newUser.save();

      req.login(newUser, (err) => { // loguear automáticamente con Passport
        if (err) return next(err);
        return res.redirect("/products");
      });
    } catch (err) {
      next(err);
    }
  }
);

// Login
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/products",
  })
);

// Logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Error al cerrar sesión");
    res.redirect("/login");
  });
});

// GitHub OAuth
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    successRedirect: "/products",
  })
);

export default router;
