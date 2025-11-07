// src/routes/views/users.views.js
import express from "express";
import { jwtAuth } from "../../middlewares/jwtAuth.js";

const router = express.Router();

router.get("/login", (req, res) => {
  const { error } = req.query;
  res.render("auth/login", { error }); // 👈 cambió el path
});

router.get("/current", jwtAuth, (req, res) => {
  const { first_name, last_name, email, role } = req.user;
  res.render("users/current", { first_name, last_name, email, role }); // 👈 nuevo path
});

export default router;
