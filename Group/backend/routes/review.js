// routes/reviews.js
import express from "express";
import { getReviews, createReview, deleteReview } from "../controllers/reviewController.js";
import { protect } from "../MiddleWares/auth.js";

const router = express.Router();

router.get("/", getReviews);
router.post("/", protect, createReview);
router.delete("/:id", protect, deleteReview);

export default router;