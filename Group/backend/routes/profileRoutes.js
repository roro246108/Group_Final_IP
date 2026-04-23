import express from "express";
import { protect } from "../MiddleWares/auth.js";
import { getMyProfile, updateMyProfile } from "../controller/profileController.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

export default router;