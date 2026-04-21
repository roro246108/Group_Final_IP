import express from "express";
import { register, login, getMe } from "../controller/authController.js";
import { protect } from "../MiddleWares/auth.js";
import { registerRules, loginRules } from "../MiddleWares/validators.js";

const router = express.Router();

router.post("/register", registerRules, register);
router.post("/login", loginRules, login);
router.get("/me", protect, getMe);

export default router;
