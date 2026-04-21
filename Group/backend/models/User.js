import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      default: "active",
    },
    ipAddress: String,
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
