// OffersContext — connects to the real backend API
// GET /offers      → public, fetches all offers from MongoDB
// POST/DELETE/PATCH → admin only, requires JWT token

import { createContext, useContext, useState, useEffect } from "react";
import { offersData } from "../data/offersData";
import hotels from "../data/hotels";
import * as offersService from "../services/offersService";

const OffersContext = createContext();

// Maps backend offer (admin format) → user format for OfferCard
const mapToUserFormat = (adminOffer) => {
  const match = offersData.find((o) => o.id === adminOffer.hotelId || o.title === adminOffer.title);
  const hotelRoom = adminOffer.hotelId ? hotels.find((h) => h.id === adminOffer.hotelId) : null;

  return {
    ...adminOffer,
    discountedPrice: adminOffer.pricePerNight,
    discountPercent: adminOffer.discount,
    originalPrice:   adminOffer.originalPrice,
    expiresAt:       match?.expiresAt || new Date(adminOffer.expiryDate).toISOString(),
    category:        adminOffer.type,
    tag:             match?.tag   || adminOffer.badge,
    tagColor:        match?.tagColor || "bg-blue-500 text-white",
    image:           hotelRoom?.image || match?.image || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    features:        match?.features  || [],
    description:     adminOffer.description || match?.description || "",
    badge:           match?.badge || adminOffer.badge,
    roomName:        hotelRoom?.roomName,
    branch:          hotelRoom?.branch,
    guests:          hotelRoom?.guests,
    beds:            hotelRoom?.beds,
    baths:           hotelRoom?.baths,
    size:            hotelRoom?.size,
    rating:          hotelRoom?.rating,
    amenities:       hotelRoom?.amenities || [],
  };
};

export function OffersProvider({ children }) {
  const [offers, setOffers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Fetch all offers from MongoDB on mount
  useEffect(() => {
    const loadOffers = async () => {
      try {
        setLoading(true);
        const data = await offersService.fetchOffers();
        setOffers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, []);

  // ADD a new offer → POST to backend
  const addOffer = async (newOffer) => {
    try {
      // Convert strings from form inputs to numbers
      const discount      = Number(newOffer.discount);
      const originalPrice = Number(newOffer.originalPrice);
      const pricePerNight = Math.round(originalPrice * (1 - discount / 100));

      const created = await offersService.createOffer({
        ...newOffer,
        discount,
        originalPrice,
        pricePerNight,
      });
      setOffers((prev) => [...prev, created]);
    } catch (err) {
      console.error("Failed to create offer:", err.message);
    }
  };

  // DELETE an offer → DELETE to backend
  const deleteOffer = async (id) => {
    try {
      await offersService.deleteOffer(id);
      setOffers((prev) => prev.filter((o) => String(o._id) !== String(id)));
    } catch (err) {
      console.error("Failed to delete offer:", err.message);
    }
  };

  // TOGGLE active/inactive → PATCH to backend
  const toggleOffer = async (id) => {
    try {
      const updated = await offersService.toggleOffer(id);
      setOffers((prev) => prev.map((o) => (String(o._id) === String(id) ? updated : o)));
    } catch (err) {
      console.error("Failed to toggle offer:", err.message);
    }
  };

  const mappedOffers = offers.map(mapToUserFormat);

  return (
    <OffersContext.Provider value={{ offers, mappedOffers, loading, error, addOffer, deleteOffer, toggleOffer }}>
      {children}
    </OffersContext.Provider>
  );
}

export function useOffers() {
  return useContext(OffersContext);
}
