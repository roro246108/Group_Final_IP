import { useState } from "react";
import { bookingsData } from "../data/bookingsData";

export default function useBookings() {

  const [bookings, setBookings] = useState(bookingsData);

  const approveBooking = (id) => {
  setBookings(prev =>
    prev.map(b =>
      b.id === id ? { ...b, status: "Confirmed" } : b
    )
  );

  const user = bookings.find(b => b.id === id);
  alert(` ${user.name} has been approved`);
};

 const cancelBooking = (id) => {
  setBookings(prev =>
    prev.map(b =>
      b.id === id ? { ...b, status: "Cancelled" } : b
    )
  );

  const user = bookings.find(b => b.id === id);
  alert(` ${user.name} has been cancelled`);
};

  const updateStatus = (id, status) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === id ? { ...b, status: status } : b
      )
    );
  };

    const addBooking = (name, status) => {
  const newBooking = {
    id: "BK" + Math.floor(Math.random() * 10000),
    name,
    status,
    email: "newuser@email.com",
    phone: "01000000000",
    notes: "New booking",
    payment: ["Created"] 
  };

  setBookings(prev => [...prev, newBooking]);
};
  return { bookings, approveBooking, cancelBooking, updateStatus, addBooking };
}