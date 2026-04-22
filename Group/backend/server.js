import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";

dotenv.config({ path: "./backend/.env" });

// middlewares
import { globalMiddlewares } from "./MiddleWares/index.js";

const app = express();
const PORT = process.env.PORT || 5050;

// global middleware
globalMiddlewares(app);

// test route
app.get("/", (req, res) => {
  res.send("API is running");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});