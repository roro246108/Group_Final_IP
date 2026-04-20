import cors from "cors";
import express from "express";
import reviewRoutes from "./routes/reviews.js";

export const globalMiddlewares = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use("/api/reviews", reviewRoutes);
};