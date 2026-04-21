import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";

// routes
import bookingRoutes from "./routes/bookingRouts.js";
import offerRoutes from "./routes/offerRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// middlewares
import { globalMiddlewares } from "./MiddleWares/index.js";

dotenv.config({ path: "./backend/.env" });
connectDB();

const app = express();

// global middleware
globalMiddlewares(app);

// routes
app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);
app.use("/offers", offerRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running ");
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});