import express from "express";
import { auth } from "../../middlewares/auth.js";

const router = express.Router();

// Login
router.get("/login", (req, res) => {
  res.render("auth/login", { error: req.query.error });
});

// Register
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// Vista protegida
router.get("/current", auth, (req, res) => {
  res.render("users/current", { user: req.user });
});

export default router;