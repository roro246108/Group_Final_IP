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
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  const isOwner = String(review.userId) === String(req.user.userId);
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await Review.findByIdAndDelete(req.params.id);
  return res.status(204).send();
};
