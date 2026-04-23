import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import mongoose from "mongoose";

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildBranchMatcher = (branch = "") => {
  const baseBranch = branch.trim().replace(/\s+Branch$/i, "");
  return new RegExp(`^${escapeRegex(baseBranch)}(?:\\s+Branch)?$`, "i");
};

const normalizeDateOnly = (value) => {
  if (!value) return null;

  const rawValue = value instanceof Date ? value.toISOString() : String(value);
  const datePart = rawValue.split("T")[0];
  const parsedDate = new Date(`${datePart}T00:00:00.000Z`);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const buildStayDateKeys = (checkIn, checkOut) => {
  const keys = [];
  const current = normalizeDateOnly(checkIn);
  const end = normalizeDateOnly(checkOut);

  if (!current || !end || current >= end) {
    return keys;
  }

  while (current < end) {
    keys.push(current.toISOString().split("T")[0]);
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return keys;
};

const roomHasManualBlock = (room, dateKeys) =>
  dateKeys.some((dateKey) => room?.dateStatuses?.[dateKey] === "reserved");

// CREATE
export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, roomId } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (roomId) {
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({ message: "Invalid room id" });
      }

      const room = await Room.findById(roomId);

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
    }

    const booking = await Booking.create({
      ...req.body,
      roomId: roomId || undefined,
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
    const { branch, roomType, roomId, roomName, checkIn, checkOut, guests } = req.body;

    if ((!branch && !roomId && !roomName) || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        message: "Room details, check-in, check-out, and guests are required",
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
      available: { $ne: false },
      status: { $nin: ["Occupied", "occupied", "Maintenance", "maintenance"] },
      guests: { $gte: guestNumber },
    };

    if (roomId) {
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({
          message: "Invalid room id",
        });
      }

      roomQuery._id = roomId;
    } else if (roomName && roomName.trim() !== "") {
      roomQuery.roomName = new RegExp(`^${escapeRegex(roomName.trim())}$`, "i");
      if (branch) {
        roomQuery.branch = buildBranchMatcher(branch);
      }
    } else if (branch) {
      roomQuery.branch = buildBranchMatcher(branch);
    }

    if (roomType && roomType.trim() !== "") {
      roomQuery.type = new RegExp(`^${escapeRegex(roomType.trim())}$`, "i");
    }

    const stayDateKeys = buildStayDateKeys(checkInDate, checkOutDate);

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

    const manuallyAvailableRooms = matchingRooms.filter(
      (room) => !roomHasManualBlock(room, stayDateKeys)
    );

    if (manuallyAvailableRooms.length === 0) {
      return res.status(404).json({
        message: "Selected dates are unavailable for this room.",
        available: false,
      });
    }

    const roomNames = manuallyAvailableRooms.map((room) => room.roomName);
    const roomIds = manuallyAvailableRooms.map((room) => String(room._id));

    const bookingQuery = {
      status: { $nin: ["cancelled", "Cancelled"] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
      $or: [
        { roomId: { $in: roomIds } },
        { roomName: { $in: roomNames } },
      ],
    };

    const overlappingBookings = await Booking.find(bookingQuery);
    const bookedRoomKeys = new Set(
      overlappingBookings.flatMap((booking) => [
        booking.roomId ? String(booking.roomId) : null,
        booking.roomName || null,
      ]).filter(Boolean)
    );
    const availableRooms = manuallyAvailableRooms.filter(
      (room) =>
        !bookedRoomKeys.has(String(room._id)) &&
        !bookedRoomKeys.has(room.roomName)
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

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      { status: "cancelled" },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
