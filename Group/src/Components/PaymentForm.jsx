import React, { useState } from "react";
import img from "../assets/Images/Visa4.png";
import { useNavigate } from "react-router-dom";


export default function PaymentForm({ room, nights, total, checkIn, checkOut }) {

  const navigate = useNavigate();

  const handleProceed = () => {
  if (!nights || nights <= 0) {
    alert("Please select your dates first to calculate total cost.");
    return;
  }

  if (!room?.roomName || !room?.price) {
    alert("Room information is missing.");
    return;
  }

  navigate("/payment", { state: { room, nights, total, checkIn, checkOut } });
};
  
  return (

    <div className="rounded-xl shadow-lg p-6 w-full max-w-[600px] bg-[#edf7ff]">

      {/* PRICE */}
      <div className="flex justify-between items-center mb-4">

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">${room.price.toFixed(2)}</span>
          <span className="text-gray-500 text-sm">{nights * room.price}</span>
        </div>

        <span className="text-sm text-gray-600 flex items-center gap-1">
          👥 Max 2 guests
        </span>

      </div>

      <hr className="mb-4"/>

      {/* SUMMARY */}
      <div className="space-y-2 text-sm">

        {nights > 0 && (
          <div className="flex justify-between">
            <span>{nights} nights at $450/night</span>
            <span>${nights * 450}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Cleaning fee</span>
          <span>$100.00</span>
        </div>

        <div className="flex justify-between">
          <span>Taxes</span>
          <span>$240.00</span>
        </div>

        <hr/>

        <div className="flex justify-between font-bold text-lg">
          <span>Total Cost</span>
          <span>${total}</span>
        </div>

      </div>

   <button
  type="button"
  onClick={handleProceed}
  className="w-full bg-[#1e3a8a] text-white py-3 rounded-xl"
>
  Pay
</button>
</div>
  );
}