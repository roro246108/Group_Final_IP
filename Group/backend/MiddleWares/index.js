import cors from "cors";
import express from "express";
import reviewRoutes from "../routes/review.js";
import bookingRoutes from "../routes/bookingRouts.js";
import authRoutes from "../routes/authRoutes.js";

export const globalMiddlewares = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/auth", authRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/bookings", bookingRoutes);
};