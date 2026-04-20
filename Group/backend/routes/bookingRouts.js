import express from "express";
import Booking from "../models/Booking.js";
import { protect } from "../MiddleWares/auth.js";

const router = express.Router();

// CREATE BOOKING
router.post("/", protect, async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;