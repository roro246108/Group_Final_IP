import { createContext, useContext, useEffect, useState } from "react";
import { logAuditEvent } from "../services/auditLogger";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    firstName: "Zeinab",
    lastName: "Mohamed",
    email: "zeinab@email.com",
    avatarInitials: "ZM",
    tier: "Gold Member",
    memberSince: "2023",
    loyaltyPoints: 1200,
    phone: "(555) 000-0000",
        bookings: [
      {
        id: 1,
        hotel: "The Grand Azure Resort",
        location: "Dubai, UAE",
        checkIn: "2026-04-10",
        checkOut: "2026-04-15",
        guests: 2,
        room: "Deluxe Ocean Suite",
        nights: 5,
        totalPrice: 2350,
        status: "upcoming",
        confirmationCode: "GAR-2024-8821",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
      },
      {
        id: 2,
        hotel: "Marina Blue Hotel",
        location: "Barcelona, Spain",
        checkIn: "2025-11-08",
        checkOut: "2025-11-12",
        guests: 1,
        room: "Standard Double Room",
        nights: 4,
        totalPrice: 880,
        status: "completed",
        rating: 5,
        confirmationCode: "MBH-2025-1102",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945"
      },
      {
        id: 3,
        hotel: "Nile Palace Resort",
        location: "Cairo, Egypt",
        checkIn: "2025-08-01",
        checkOut: "2025-08-06",
        guests: 3,
        room: "Executive Suite",
        nights: 5,
        totalPrice: 1650,
        status: "completed",
        rating: 4,
        confirmationCode: "NPR-2025-0744",
        image: "https://images.unsplash.com/photo-1541971875076-8f970d573be6"
      },
      {
        id: 4,
        hotel: "Azure Cliff Retreat",
        location: "Santorini, Greece",
        checkIn: "2025-06-14",
        checkOut: "2025-06-18",
        guests: 2,
        room: "Infinity Pool Villa",
        nights: 4,
        totalPrice: 3200,
        status: "cancelled",
        confirmationCode: "ACR-2025-0511",
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"
      }
    ],
  });

  // This fixes the "updateUser is not a function" error in EditProfileForm.jsx
  const updateUser = (updatedData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedData,
    }));
  };

  const cancelBooking = (id) => {
    setUser(prevUser => ({
      ...prevUser,
      bookings: prevUser.bookings.map(booking => 
        booking.id === id 
          ? { ...booking, status: 'cancelled' } 
          : booking
      )
    }));
  };

  useEffect(() => {
    logAuditEvent({
      actionType: "user.login",
      module: "auth",
      entityType: "session",
      entityId: String(user.email),
      targetLabel: `${user.firstName} ${user.lastName}`,
      status: "success",
      reason: "User session initialized",
    });
  }, [user.email, user.firstName, user.lastName]);

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, cancelBooking }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}