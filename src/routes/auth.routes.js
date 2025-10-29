import { Router } from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = Router();

// ----- Registro -----
router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.render("auth/register", { error: "Usuario ya registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === "adminCoder@coder.com" ? "admin" : "user";

    const newUser = await User.create({ first_name, last_name, email, password: hashedPassword, role });

    req.login(newUser, (err) => {
      if (err) return next(err);
      return res.redirect("/products");
    });

  } catch (err) {
    next(err);
  }
});

// ----- Login -----
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureMessage: true
}), (req, res) => {
  res.redirect("/products");
});

// ----- Logout -----
router.post("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/login");
  });
});

// ----- GitHub OAuth -----
router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/products");
  }
);

export default router;
