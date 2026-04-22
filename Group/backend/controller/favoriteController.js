import User from "../models/User.js";
import Hotel from "../models/Hotel.js";

// ADD / REMOVE FAVORITE
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { hotelId, roomId } = req.body;

    if (!hotelId || !roomId) {
      return res.status(400).json({
        message: "hotelId and roomId are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingIndex = user.favorites.findIndex(
      (fav) =>
        fav.hotelId.toString() === hotelId &&
        fav.roomId.toString() === roomId
    );

    let action = "";

    if (existingIndex > -1) {
      user.favorites.splice(existingIndex, 1);
      action = "removed";
    } else {
      user.favorites.push({ hotelId, roomId });
      action = "added";
    }

    await user.save();

    res.status(200).json({
      message: `Favorite ${action} successfully`,
      action,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET MY FAVORITES
export const getMyFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const favorites = user.favorites || [];

    if (favorites.length === 0) {
      return res.status(200).json({
        count: 0,
        favorites: [],
      });
    }

    const hotelIds = [...new Set(favorites.map((fav) => fav.hotelId.toString()))];
    const hotels = await Hotel.find({ _id: { $in: hotelIds } }).lean();

    const favoriteRooms = [];

    favorites.forEach((fav) => {
      const hotel = hotels.find(
        (h) => h._id.toString() === fav.hotelId.toString()
      );

      if (!hotel) return;

      const room = hotel.rooms.find(
        (r) => r._id && r._id.toString() === fav.roomId.toString()
      );

      if (!room) return;

      favoriteRooms.push({
        _id: room._id,
        hotelId: hotel._id,
        hotelName: hotel.hotelName,
        branch: hotel.name,
        city: hotel.city,
        location: hotel.address,
        status: hotel.status,
        roomName: room.roomName,
        type: room.type,
        price: room.price,
        rating: room.rating ?? hotel.rating ?? 0,
        guests: room.guests,
        beds: room.beds,
        baths: room.baths,
        size: room.size ?? 0,
        available: room.available,
        featured: room.featured,
        image: room.image || hotel.image,
        amenities:
          room.amenities && room.amenities.length > 0
            ? room.amenities
            : hotel.amenities,
        description: hotel.description,
        phone: hotel.phone,
        email: hotel.email,
      });
    });

    res.status(200).json({
      count: favoriteRooms.length,
      favorites: favoriteRooms,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};