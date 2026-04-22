// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },

  roomName: { type: String, trim: true },
  price: { type: Number, min: 0 },
  nights: { type: Number, min: 1 },
  total: { type: Number, min: 0 },

  // added for home page search / availability
  branch: { type: String, trim: true },
  guests: { type: Number, min: 1 },

  checkIn: { type: Date },
  checkOut: { type: Date },

  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "confirmed",
  },

  userId: { type: String },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Booking", bookingSchema);