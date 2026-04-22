import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: [true, "Room name is required"],
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Room type is required"],
    enum: ["Standard", "Deluxe", "Suite", "Penthouse"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  rating: {
    type: Number,
    min: [0, "Rating cannot be less than 0"],
    max: [5, "Rating cannot be more than 5"],
    default: 0,
  },
  guests: {
    type: Number,
    required: [true, "Guests number is required"],
    min: [1, "Guests must be at least 1"],
  },
  beds: {
    type: Number,
    required: [true, "Beds number is required"],
    min: [1, "Beds must be at least 1"],
  },
  baths: {
    type: Number,
    required: [true, "Baths number is required"],
    min: [1, "Baths must be at least 1"],
  },
  size: {
    type: Number,
    min: [0, "Size cannot be negative"],
    default: 0,
  },
  available: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    default: "",
  },
  amenities: {
    type: [String],
    default: [],
  },
});

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Branch name is required"],
      trim: true,
    },
    hotelName: {
      type: String,
      required: [true, "Hotel name is required"],
      trim: true,
      default: "Blue Wave Hotel",
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    amenities: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    rooms: {
      type: [roomSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);