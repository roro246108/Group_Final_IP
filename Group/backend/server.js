import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";

// routes
import bookingRoutes from "./routes/bookingRouts.js";
import authRoutes from "./routes/authRoutes.js";

// middlewares
import { globalMiddlewares } from "./MiddleWares/index.js";

dotenv.config({ path: "./backend/.env" });

const app = express();
const PORT = process.env.PORT || 5050;

// global middleware
globalMiddlewares(app);

// routes
app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});