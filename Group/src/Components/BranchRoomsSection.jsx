import React from "react";
import { useNavigate } from "react-router-dom";

export default function BranchRoomsSection({ rooms = [] }) {
  const navigate = useNavigate();

  const handleBookRoom = (room) => {
    navigate("/booking", {
      state: { room },
    });
  };

  return (
    <section className="bg-[#edf7ff] py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-[#0b2b6f] leading-tight mb-4">
            Accommodations
          </h2>
          <p className="text-[#5f6f8c] max-w-2xl text-sm md:text-base leading-relaxed">
            Choose from our carefully curated selection of rooms and suites, each designed for ultimate comfort and elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <div
              key={room.id || index}
              className="group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
            >
              <div className="relative overflow-hidden">
                <img
                  src={room.image}
                  alt={room.roomName}
                  className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <span className="absolute bottom-3 right-3 bg-white text-gray-700 text-sm font-semibold px-3 py-1 rounded-full shadow z-10">
                  ${room.price}/night
                </span>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-serif text-[#0b1f44]">
                    {room.roomName}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {room.guests} Guests
                  </span>
                </div>

                <p className="text-gray-600 text-sm leading-6 mb-4">
                  {room.cardDescription || room.roomName}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {(room.amenities || []).slice(0, 3).map((feature, i) => (
                    <span
                      key={i}
                      className="bg-[#f3f4f6] text-gray-600 text-xs px-3 py-1 rounded-md"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleBookRoom(room)}
                  className="group/button w-full bg-[#d9ecff] text-[#071d49] py-3 rounded-xl font-medium transition-all duration-300 hover:bg-[#0b2b6f] hover:text-white hover:shadow-lg"
                >
                  <span className="inline-flex items-center transition-transform duration-300 group-hover/button:translate-x-2">
                    Book Room
                    <span className="ml-2 transition-transform duration-300 group-hover/button:translate-x-1">
                      →
                    </span>
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}