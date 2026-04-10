import { Router } from "express";
import passport from "passport";
import { googleAuthCallback } from "../controllers/GoogleAuthController.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth" }),
  googleAuthCallback
);

export default router;
