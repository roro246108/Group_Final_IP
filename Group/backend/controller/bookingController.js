import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildBranchMatcher = (branch = "") => {
  const baseBranch = branch.trim().replace(/\s+Branch$/i, "");
  return new RegExp(`^${escapeRegex(baseBranch)}(?:\\s+Branch)?$`, "i");
};

// CREATE
export const createBooking = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const booking = await Booking.create({
      ...req.body,
      userId: req.user?.userId,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SEARCH AVAILABILITY
export const searchAvailability = async (req, res) => {
  try {
    const { branch, roomType, checkIn, checkOut, guests } = req.body;

    if (!branch || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        message: "Branch, check-in, check-out, and guests are required",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    if (checkInDate < today || checkOutDate < today) {
      return res.status(400).json({
        message: "You cannot search using past dates",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
    }

    const guestNumber = Number(guests);

    if (!Number.isFinite(guestNumber) || guestNumber < 1) {
      return res.status(400).json({
        message: "Guests must be a valid number",
      });
    }

    // Build query to find available rooms by branch, optional room type, and guest capacity.
    const roomQuery = {
      branch: buildBranchMatcher(branch),
      available: { $ne: false },
      status: { $nin: ["Occupied", "occupied", "Maintenance", "maintenance"] },
      guests: { $gte: guestNumber },
    };

    if (roomType && roomType.trim() !== "") {
      roomQuery.type = new RegExp(`^${escapeRegex(roomType.trim())}$`, "i");
    }

    console.log("Incoming search body:", {
      branch,
      roomType,
      checkIn,
      checkOut,
      guests,
    });

    console.log("Room query:", roomQuery);

    const matchingRooms = await Room.find(roomQuery);
    console.log("Matching rooms found:", matchingRooms.length);

    if (matchingRooms.length === 0) {
      return res.status(404).json({
        message: "No rooms available matching your criteria",
        available: false,
      });
    }

    // Get room names to check for booking conflicts
    const roomNames = matchingRooms.map((room) => room.roomName);

    // Check for booking conflicts with these specific rooms
    const bookingQuery = {
      roomName: { $in: roomNames },
      status: { $nin: ["cancelled", "Cancelled"] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    };

    const overlappingBookings = await Booking.find(bookingQuery);
    const bookedRoomNames = new Set(
      overlappingBookings.map((booking) => booking.roomName)
    );
    const availableRooms = matchingRooms.filter(
      (room) => !bookedRoomNames.has(room.roomName)
    );

    console.log("Overlapping bookings found:", overlappingBookings.length);
    console.log("Matching bookings:", overlappingBookings);

    if (availableRooms.length === 0) {
      return res.status(409).json({
        message:
          "These dates are reserved for this room type. Please choose different dates.",
        available: false,
      });
    }

    return res.status(200).json({
      message: "Dates are available",
      available: true,
      data: {
        branch,
        roomType,
        checkIn,
        checkOut,
        guests,
      },
      rooms: availableRooms,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "firstName email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "firstName email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate("userId", "firstName email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
