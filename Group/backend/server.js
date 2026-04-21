import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";

// routes

import offerRoutes from "./routes/offerRoutes.js";


// middlewares
import { globalMiddlewares } from "./MiddleWares/index.js";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5050;

// global middleware
globalMiddlewares(app);

// routes

app.use("/offers", offerRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});