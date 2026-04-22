import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },

  email: { 
    type: String, 
    required: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email"]
  },

  phone: { 
    type: String, 
    required: true 
  },

  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending"
  },

  roomName: { 
    type: String 
  },

  price: { 
    type: Number,
    required: true,
    min: 0
  },

  nights: { 
    type: Number,
    required: true,
    min: 1
  },

  total: { 
    type: Number,
    required: true,
    min: 0
  },

  notes: String,

  payment: {
    type: [String],
    default: ["Booking created"]
  },

  checkIn: { 
    type: Date, 
    required: true 
  },

  checkOut: { 
    type: Date, 
    required: true 
  },

 
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true }); 

export default mongoose.model("Booking", bookingSchema);