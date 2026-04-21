import express from "express";
import {
  register,
  login,
  getMe,
  getAllUsers,
} from "../controller/authController.js";

import { protect } from "../MiddleWares/auth.js";
import { registerRules, loginRules } from "../MiddleWares/validators.js";

const router = express.Router();

router.post("/register", registerRules, register);
router.post("/login", loginRules, login);

// protected routes
router.get("/me", protect, getMe);
router.get("/users", protect, getAllUsers);

export default router;
