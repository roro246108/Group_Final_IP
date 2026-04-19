import Navbar from "../Components/Navbar";
import PaymentForm from "../Components/PaymentForm";
import RoomDetails from "../Components/RoomDetails";
import BookingCard from "../Components/BookingCard";
import { useState } from "react";
import { useLocation } from "react-router-dom";

import { calculateNights, calculateTotal } from "../hooks/useBookingpayment";

export default function RoomBooking() {

  const location = useLocation();
  const room = location.state?.room || location.state?.selectedRoom;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [nights, setNights] = useState(0);
  const [total, setTotal] = useState(0);

  
  if (!room) {
    return <p className="text-center mt-40 text-xl">No room selected </p>;
  }

  const handleCheckAvailability = () => {

    if (!checkIn || !checkOut) {
      alert("Please select both dates.");
      return;
    }

    const calculatedNights = calculateNights(checkIn, checkOut);

    if (calculatedNights <= 0) {
      alert("Check-out must be after check-in.");
      return;
    }

    const calculatedTotal = calculateTotal(calculatedNights, room.price);

    setNights(calculatedNights);
    setTotal(calculatedTotal);

    alert(`Room is available for ${calculatedNights} nights`);
  };

  return (
    <>
      <Navbar />

      <div className="pt-40 flex justify-center w-full">

        <div className="grid grid-cols-2 gap-10 max-w-7xl w-full px-10">

          {/* LEFT */}
          <div className="space-y-6">

           <RoomDetails room={room} />

            <BookingCard
              checkIn={checkIn}
              checkOut={checkOut}
              setCheckIn={setCheckIn}
              setCheckOut={setCheckOut}
              onCheckAvailability={handleCheckAvailability}
            />

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            <div>

              <div className="flex items-center gap-3 mt-2">
                <span className="bg-[#1e3a8a] text-white text-sm px-3 py-1 rounded-full">
                  {room.type}
                </span>

                <span className="text-yellow-500">
                  ⭐ {room.rating}
                </span>

                <span className="text-gray-500 text-sm">
                  ({Math.floor(room.rating * 30)} reviews)
                </span>
              </div>

              <h2 className="text-3xl font-semibold">
                {room.roomName}
              </h2>

              <p className="text-gray-600 mt-3">
                {room.type} room in {room.city} with capacity for {room.guests} guests.
              </p>

              {/* Amenities */}
              <div className="grid grid-cols-2 gap-3 mt-6 text-gray-600">
                {room.amenities.map((item, index) => (
                  <p key={index}>✔ {item}</p>
                ))}
              </div>

            </div>

  <PaymentForm
  room={room}   
  nights={nights}
  total={total}
/>

          </div>

        </div>

      </div>
    </>
  );
}