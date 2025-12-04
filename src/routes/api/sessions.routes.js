import { Router } from "express";
import passport from "passport";
import UserDTO from "../../dto/user.dto.js"; // <-- IMPORTAMOS EL DTO

const router = Router();

// /api/sessions/current
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const safeUser = new UserDTO(req.user); // <-- LIMPIAMOS AL USUARIO

    res.send({
      status: "success",
      user: safeUser
    });
  }
);

export default router;