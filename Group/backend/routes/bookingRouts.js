// routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from "../controller/bookingController.js";

import { protect } from "../MiddleWares/auth.js";

const router = express.Router();

router.get("/", protect, getBookings); // GET all
router.get("/:id", protect, getBookingById); // GET one
router.post("/", protect, createBooking); // CREATE
router.patch("/:id", protect, updateBooking); // UPDATE
router.delete("/:id", protect, deleteBooking); // DELETE


export default router;
