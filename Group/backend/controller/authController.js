import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

function getJwtSecret() {
  return process.env.JWT_SECRET || "group-project-dev-secret";
}

function sanitizeUser(userDocument) {
  return {
    id: userDocument._id.toString(),
    fullName: userDocument.fullName,
    email: userDocument.email,
    phone: userDocument.phone,
    role: userDocument.role,
    status: userDocument.status,
    joinedAt: userDocument.joinedAt,
    lastLoginAt: userDocument.lastLoginAt,
  };
}

function signToken(userDocument) {
  return jwt.sign(
    {
      userId: userDocument._id.toString(),
      email: userDocument.email,
      role: userDocument.role,
      fullName: userDocument.fullName,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    }
  );
}

export async function registerUser(req, res) {
  try {
    const fullName = String(req.body?.fullName ?? "").trim();
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const phone = String(req.body?.phone ?? "").trim();
    const password = String(req.body?.password ?? "");

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const role = email === "admin@hotel.com" ? "admin" : "user";
    const createdUser = await User.create({
      fullName,
      email,
      phone,
      passwordHash: hashPassword(password),
      role,
      status: "active",
      joinedAt: new Date(),
      lastLoginAt: new Date(),
    });

    const token = signToken(createdUser);
    return res.status(201).json({
      token,
      user: sanitizeUser(createdUser),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Registration failed.",
      error: error.message,
    });
  }
}

export async function loginUser(req, res) {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user);
    return res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load current user.",
      error: error.message,
    });
  }
}

export async function logoutUser(req, res) {
  return res.json({ message: "Logged out successfully." });
}
