import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    // UPDATED: Added "staff" and "customer" to match your React filters
    role: {
      type: String,
      enum: ["user", "admin", "staff", "customer"], 
      default: "user",
    },
    // UPDATED: Added enum to prevent accidental values like "deleted"
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
    address: String, // Added this since your React table shows addresses
    avatar: String,  // Added this for the profile pictures in your table
    ipAddress: String,
    lastLoginAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
