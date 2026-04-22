import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

// middlewares
import { globalMiddlewares } from "./MiddleWares/index.js";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5050;

// global middleware
globalMiddlewares(app);

// test route
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/auth", authRoutes);
app.use("/hotels", hotelRoutes);
app.use("/favorites", favoriteRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});