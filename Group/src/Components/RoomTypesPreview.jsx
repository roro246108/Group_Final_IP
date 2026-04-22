import { Link } from "react-router-dom";
import suiteAlex from "/Images/Suite.jpg";
import suiteCairo from "/Images/Suite3.jpg";
import penthouseSharm from "/Images/Penthouse4.jpg";

const rooms = [
  {
    id: 1,
    name: "Ocean View Suite",
    price: "$320/night",
    description:
      "Panoramic sea views, elegant interiors, and premium comfort for an unforgettable Alexandria stay.",
    image: suiteAlex,
  },
  {
    id: 2,
    name: "Business Suite",
    price: "$295/night",
    description:
      "A refined suite in Cairo designed for stylish city stays, added comfort, and business convenience.",
    image: suiteCairo,
  },
  {
    id: 3,
    name: "Paradise Penthouse",
    price: "$690/night",
    description:
      "An exceptional luxury stay in Sharm El Sheikh with private pool comfort, ocean views, and elegant privacy.",
    image: penthouseSharm,
  },
];

export default function RoomTypesPreview() {
  return (
    <section className="bg-[#F8FAFC] px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#7ea0d6]">
            Room Types
          </p>

          <h2 className="mt-4 text-3xl font-semibold text-[#2F4156] md:text-5xl">
            Discover Your Perfect Stay
          </h2>

          <p className="mt-5 text-base leading-8 text-[#5c6b7a] md:text-lg">
            Explore a selection of our real room categories, designed for
            comfort, elegance, and memorable moments.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#2F4156] shadow-md">
                  {room.price}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-semibold text-[#2F4156]">
                  {room.name}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#5c6b7a] md:text-base">
                  {room.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/hotels"
            className="inline-block rounded-full bg-[#2F4156] px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#7ea0d6]"
          >
            View All Rooms
          </Link>
        </div>
      </div>
    </section>
  );
}