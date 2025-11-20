import { Router } from "express";
import passport from "passport";

const router = Router();

// /api/sessions/current
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send({
      status: "success",
      user: {
        id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role
      }
    });
  }
);

export default router;