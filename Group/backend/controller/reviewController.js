// controllers/reviewController.js
import Review from "../models/Review.js";

export const getReviews = async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
};

export const createReview = async (req, res) => {
  const review = await Review.create({
    ...req.body,
    userId: req.user.userId
  });
  res.status(201).json(review);
};

export const deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.status(204).send();
};