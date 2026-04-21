// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  roomName: String,
  price: Number,
  nights: Number,
  total: Number,
  
  checkIn: Date,
  checkOut: Date,

  userId: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Booking", bookingSchema);