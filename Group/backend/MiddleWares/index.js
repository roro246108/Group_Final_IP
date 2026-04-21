import cors from "cors";
import express from "express";
import reviewRoutes from "../routes/review.js";
import contactRoutes from "../routes/contactRoutes.js";
import userPreferencesRoutes from "../routes/userPreferencesRoutes.js";
import bookingRoutes from "../routes/bookingRouts.js";
import authRoutes from "../routes/auth.js";

export const globalMiddlewares = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use("/api/contact-messages", contactRoutes);
  app.use("/api/admin/preferences", userPreferencesRoutes);
};
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/auth", authRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/bookings", bookingRoutes);
};
