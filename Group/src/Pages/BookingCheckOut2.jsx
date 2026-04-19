
import Navbar from "../Components/Navbar";
import PaymentForm from "../Components/PaymentForm";
import RoomDetails from "../Components/RoomDetails";
import BookingCard from "../Components/BookingCard";
import { useState } from "react";
import { calculateNights, calculateTotal } from "../hooks/useBookingpayment";

export default function RoomBooking(){

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [nights, setNights] = useState(0);
  const [total, setTotal] = useState(0);

  const handleCheckAvailability = () => {

  if (!checkIn || !checkOut) {
    alert("Please select both dates.");
    return;
  }

  const nights = calculateNights(checkIn, checkOut);

  if (nights <= 0) {
    alert("Check-out must be after check-in.");
    return;
  }

  const total = calculateTotal(nights);

  // ✅ UPDATE UI
  setNights(nights);
  setTotal(total);

  // ✅ ADD POP MESSAGE 
  alert(`Room is available for ${nights} `);
};

  return(
    <>
      <Navbar />

      <div className="pt-40 flex justify-center w-full">

        <div className="grid grid-cols-2 gap-10 max-w-7xl w-full px-10">

          {/* LEFT */}
          <div className="space-y-6">

            <RoomDetails />

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
                <span className="bg-[#5F7F8A] text-white text-sm px-3 py-1 rounded-full">
                  Standered
                </span>

                <span className="text-yellow-500">
                  ⭐ ⭐ ⭐ 
                </span>

                <span className="text-gray-500 text-sm">
                  (120 reviews)
                </span>
              </div>

              <h2 className="text-3xl font-semibold">
                Standered Room
              </h2>

              <p className="text-gray-600 mt-3">
                Comfortable room with modern design, cozy bed, and essential amenities for a relaxing stay.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6 text-gray-600">
                <p>✔ WiFi</p>
                <p>✔ Air Conditioning</p>
                <p>✔ TV</p>
                <p>✔ Private Bathroom</p>
                <p>✔ Room Service</p>
                
              </div>

            </div>

            <PaymentForm nights={nights} total={total} />

          </div>

        </div>

      </div>
    </>
  );
}