import express from "express";
import {
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  toggleOffer,
  deleteOffer,
} from "../controllers/offerController.js";
import { protect } from "../MiddleWares/auth.js";

const router = express.Router();

// PUBLIC — anyone can view offers
router.get("/", getOffers);
router.get("/:id", getOfferById);

// PROTECTED — admin only (requires valid JWT token)
router.post("/", protect, createOffer);
router.put("/:id", protect, updateOffer);
router.patch("/:id/toggle", protect, toggleOffer);
router.delete("/:id", protect, deleteOffer);

export default router;
