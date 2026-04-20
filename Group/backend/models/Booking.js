import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,

  cardNumber: String,
  expiry: String,
  cvv: String,

  roomName: String,
  price: Number,
  nights: Number,
  total: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Booking", bookingSchema);