import express from "express";
import { signup, login, logout } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { getMe } from "../controllers/auth.controller";
import { googleLogin } from "../controllers/auth.controller";

const router = express.Router();
router.post("/login", login);       // already exists
router.post("/google", googleLogin); // add this
router.post("/signup", signup);
router.post("/logout", logout);
router.get(
  "/me",
  authMiddleware,
  getMe
);


export default router;
