import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title:         { type: String, required: true, trim: true },
    type:          { type: String, enum: ["Bundle", "Discount", "Package", "Seasonal"], required: true },
    badge:         { type: String, required: true },
    discount:      { type: Number, required: true, min: 1, max: 99 },
    originalPrice: { type: Number, required: true, min: 1 },
    pricePerNight: { type: Number, required: true, min: 1 },
    expiryDate:    { type: Date, required: true },
    active:        { type: Boolean, default: true },
    description:   { type: String, default: "" },
    hotelId:       { type: Number },   // links to room in hotels.js
  },
  { timestamps: true }
);

export default mongoose.model("Offer", offerSchema);
