import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  password: String,
  phone: String,
  role: String,
  status: String,
  ipAddress: String,
  joinedAt: Date,
  lastLoginAt: Date,
});

export default mongoose.model("User", userSchema);