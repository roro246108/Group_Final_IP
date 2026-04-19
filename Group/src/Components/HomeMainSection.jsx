import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import MainBackground from "../assets/Images/home_video.mp4";

export default function HomeMainSection() {
  const navigate = useNavigate();

  const [branch, setBranch] = useState("Cairo Branch");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1 Guest");

  // Example reserved dates for each branch
  const reservedDates = {
    "Cairo Branch": ["2026-03-20", "2026-03-21"],
    "Alexandria Branch": ["2026-04-02", "2026-04-03"],
    "Marsa Alam Branch": ["2026-04-10"],
    "Sharm El Sheikh Branch": ["2026-05-05", "2026-05-06"],
    "Ain El Sokhna Branch": ["2026-06-12"],
  };

  const isPastDate = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const chosenDate = new Date(dateString);
    chosenDate.setHours(0, 0, 0, 0);

    return chosenDate < today;
  };

  const getDatesBetween = (startDate, endDate) => {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const hasReservedDateInRange = (branchName, startDate, endDate) => {
    const selectedDates = getDatesBetween(startDate, endDate);
    const reserved = reservedDates[branchName] || [];
    return selectedDates.some((date) => reserved.includes(date));
  };

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    if (isPastDate(checkIn) || isPastDate(checkOut)) {
      alert("You cannot search using past dates.");
      return;
    }

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    if (outDate <= inDate) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    if (hasReservedDateInRange(branch, checkIn, checkOut)) {
      alert("These dates are reserved. Please choose different dates.");
      return;
    }

    alert(
      `You selected:\nBranch: ${branch}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guests}`
    );

    navigate("/hotels", {
      state: {
        branch,
        checkIn,
        checkOut,
        guests,
      },
    });
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Hero / Video Area */}
      <div className="relative min-h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={MainBackground} type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Main Content */}
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-start px-6 pt-36 text-center md:pt-44">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#C8D9E6] md:text-sm">
            Welcome to Blue Waves Hotel
          </p>

          <h1 className="max-w-5xl text-5xl font-semibold leading-[1.05] text-white md:text-7xl">
            Experience Comfort Like Never Before
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-8 text-white/90 md:text-[22px]">
            Book premium stays, exclusive offers, and unforgettable experiences
            in our finest destinations.
          </p>
        </div>

        {/* Curved White Shape */}
        <div className="absolute -bottom-6 left-0 z-10 w-full overflow-hidden leading-none md:-bottom-8">
          <svg
            viewBox="0 0 1440 220"
            className="block h-[120px] w-full md:h-[160px]"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              d="M0,105 C240,55 470,45 720,105 C980,170 1180,160 1440,70 L1440,220 L0,220 Z"
            />
          </svg>
        </div>
      </div>

      {/* Buttons */}
      <div className="relative z-20 mx-auto -mt-20 flex w-full justify-center px-6 pb-10 md:-mt-24 md:pb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link
            to="/hotelDetails"
            className="rounded-full bg-[#7ea0d6] px-8 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#2f6fb3]"
          >
            Explore Hotels
          </Link>

          <Link
            to="/offers"
            className="rounded-full border border-[#2F4156] bg-white px-8 py-3 text-sm font-medium text-[#2F4156] transition-all duration-300 hover:-translate-y-1 hover:bg-[#2F4156] hover:text-white"
          >
            View Offers
          </Link>
        </div>
      </div>

      {/* Search Bar Below Curve - New Design */}
      <div className="relative z-20 mx-auto mt-4 w-full max-w-7xl px-6 pb-12 md:mt-6 md:pb-16">
        <div className="rounded-[22px] bg-[#bfd1e0] p-4 md:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            {/* Branch */}
            <div className="xl:col-span-1">
              <label className="mb-2 block text-sm font-semibold text-[#2F4156]">
                Branch
              </label>
              <div className="relative">
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full appearance-none rounded-2xl bg-white px-4 py-3 pr-12 text-[#2F4156] outline-none"
                >
                  <option>Cairo Branch</option>
                  <option>Alexandria Branch</option>
                  <option>Marsa Alam Branch</option>
                  <option>Sharm El Sheikh Branch</option>
                  <option>Ain El Sokhna Branch</option>
                </select>
                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#2F4156]"
                />
              </div>
            </div>

            {/* Check-in */}
            <div className="xl:col-span-1">
              <label className="mb-2 block text-sm font-semibold text-[#2F4156]">
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-2xl bg-white px-4 py-3 text-[#2F4156] outline-none"
              />
            </div>

            {/* Check-out */}
            <div className="xl:col-span-1">
              <label className="mb-2 block text-sm font-semibold text-[#2F4156]">
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-2xl bg-white px-4 py-3 text-[#2F4156] outline-none"
              />
            </div>

            {/* Guests */}
            <div className="xl:col-span-1">
              <label className="mb-2 block text-sm font-semibold text-[#2F4156]">
                Guests
              </label>
              <div className="relative">
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full appearance-none rounded-2xl bg-white px-4 py-3 pr-12 text-[#2F4156] outline-none"
                >
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4 Guests</option>
                  <option>5+ Guests</option>
                </select>
                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#2F4156]"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="xl:col-span-1">
              <label className="mb-2 block text-sm font-semibold opacity-0">
                Search
              </label>
              <button
                onClick={handleSearch}
                className="w-full rounded-2xl bg-[#2F4156] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#7ea0d6]"
              >
                Search Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}