import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /auth/login
// Receives { email, role } from the frontend after local auth passes
// Returns a signed JWT token so admin can make protected API calls
router.post("/login", (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ message: "Email and role are required" });
  }

  const token = jwt.sign(
    { email, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({ token, email, role });
});

// POST /auth/logout
// JWT is stateless so logout is handled on the frontend (clearing the token)
// This endpoint exists to satisfy the backend logout requirement
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
