// This file creates a shared state for offers
// Both AdminOffersPage and OffersPage read from here
// When admin deletes an offer, it disappears from the user page too
// Uses localStorage so changes survive page refreshes and tab switches

import { createContext, useContext, useState, useEffect } from "react";
import { initialOffers } from "../data/adminData";
import { offersData } from "../data/offersData";

// 1. Create the context
const OffersContext = createContext();

// This function maps adminData fields → offersData fields so OfferCard works correctly
const mapToUserFormat = (adminOffer) => {
  const match = offersData.find((o) => o.id === adminOffer.id);

  return {
    ...adminOffer,
    discountedPrice: adminOffer.pricePerNight,
    discountPercent: adminOffer.discount,
    expiresAt: match?.expiresAt || new Date(adminOffer.expiryDate).toISOString(),
    category: adminOffer.type,
    tag: match?.tag || adminOffer.badge,
    tagColor: match?.tagColor || "bg-blue-500 text-white",
    image: match?.image || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    features: match?.features || [],
    description: match?.description || "",
    badge: match?.badge || adminOffer.badge,
  };
};

// 2. Create the provider
export function OffersProvider({ children }) {

  // Load from localStorage if exists, otherwise use initialOffers from adminData.js
  const [offers, setOffers] = useState(() => {
    try {
      const saved = localStorage.getItem("hotelOffers");
      return saved ? JSON.parse(saved) : initialOffers;
    } catch {
      return initialOffers;
    }
  });

  // Every time offers changes, save to localStorage automatically
  useEffect(() => {
    try {
      localStorage.setItem("hotelOffers", JSON.stringify(offers));
    } catch {
      console.error("Could not save offers to localStorage");
    }
  }, [offers]);

  // ADD a new offer
  const addOffer = (newOffer) => {
    setOffers((prev) => [
      ...prev,
      {
        id: Date.now(),
        active: true,
        pricePerNight: Math.round(newOffer.originalPrice * (1 - newOffer.discount / 100)),
        ...newOffer,
      },
    ]);
  };

  // DELETE an offer by id
  const deleteOffer = (id) => {
    setOffers((prev) => prev.filter((offer) => offer.id !== id));
  };

  // TOGGLE active/inactive
  const toggleOffer = (id) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === id ? { ...offer, active: !offer.active } : offer
      )
    );
  };

  // Map offers to user format so OfferCard displays correctly
  const mappedOffers = offers.map(mapToUserFormat);

  return (
    <OffersContext.Provider value={{ offers, mappedOffers, addOffer, deleteOffer, toggleOffer }}>
      {children}
    </OffersContext.Provider>
  );
}

// 3. Custom hook to use the context easily
export function useOffers() {
  return useContext(OffersContext);
}
