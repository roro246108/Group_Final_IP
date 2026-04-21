// models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: String,
  title: String,
  comment: String,
  rating: Number,
  branch: String,
  userId: String, // from JWT
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Review", reviewSchema);