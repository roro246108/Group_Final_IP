import { Link } from "react-router-dom";
import { Star, CheckCircle } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Business Traveler",
    time: "2 weeks ago",
    title: "Exceptional Service",
    text: "The staff went above and beyond to make our anniversary special. The ocean view from our suite was breathtaking, and the spa treatments were world-class.",
    image: "https://i.pravatar.cc/100?img=32",
  },
  {
    id: 2,
    name: "James Kennedy",
    role: "Family Vacation",
    time: "1 month ago",
    title: "Perfect Family Getaway",
    text: "Kids loved the pool, and we loved the peace and quiet. The connecting rooms were perfect for our family of four. Will definitely return!",
    image: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: 3,
    name: "Emma Laurent",
    role: "Solo Traveler",
    time: "2 months ago",
    title: "Beautiful but Pricey",
    text: "Absolutely gorgeous property with impeccable service. The only downside is the price of dining on-site, but the location makes up for it.",
    image: "https://i.pravatar.cc/100?img=47",
  },
  {
    id: 4,
    name: "Michael Rodriguez",
    role: "Couple",
    time: "3 months ago",
    title: "Culinary Excellence",
    text: "The Azure Restaurant deserves its own Michelin star. Every meal was an experience. The sommelier’s wine pairings were perfect.",
    image: "https://i.pravatar.cc/100?img=15",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Honeymoon",
    time: "3 months ago",
    title: "Dream Honeymoon",
    text: "They arranged everything perfectly — from rose petals on the bed to a private beach dinner. The presidential suite is worth every penny.",
    image: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: 6,
    name: "David Chen",
    role: "Business",
    time: "4 months ago",
    title: "Best Business Hotel",
    text: "Fast WiFi, great workspace in the room, and excellent room service. The location is convenient for LA meetings while avoiding the city chaos.",
    image: "https://i.pravatar.cc/100?img=60",
  },
];

export default function ReviewsPreview() {
  return (
    <section className="bg-white px-6 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-[#2F4156] md:text-5xl">
            Guest Reviews
          </h2>

          <div className="mt-4 flex items-center justify-center gap-2 text-[#f4b400]">
            {[...Array(5)].map((_, index) => (
              <Star key={index} size={18} className="fill-[#f4b400] text-[#f4b400]" />
            ))}
            <span className="ml-1 text-base font-semibold text-[#2F4156]">4.9</span>
          </div>

          <p className="mt-3 text-sm text-[#6b7b8c] md:text-base">
            Based on 1,247 verified guest reviews
          </p>
        </div>

        {/* Review Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-[#dbe4f0] bg-[#EEF4FB] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Top */}
              <div className="flex items-start gap-3">
                <img
                  src={review.image}
                  alt={review.name}
                  className="h-11 w-11 rounded-full object-cover"
                />

                <div>
                  <h3 className="text-sm font-semibold text-[#2F4156] md:text-base">
                    {review.name}
                  </h3>
                  <p className="text-xs text-[#7b8a9a] md:text-sm">
                    {review.role} • {review.time}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="mt-4 flex items-center gap-1 text-[#f4b400]">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={15} className="fill-[#f4b400] text-[#f4b400]" />
                ))}
              </div>

              {/* Title */}
              <h4 className="mt-4 text-base font-semibold text-[#2F4156]">
                {review.title}
              </h4>

              {/* Text */}
              <p className="mt-3 text-sm leading-7 text-[#5c6b7a]">
                {review.text}
              </p>

              {/* Verified */}
              <div className="mt-4 flex items-center gap-2 text-sm text-[#52a56b]">
                <CheckCircle size={16} className="fill-white text-[#52a56b]" />
                <span>Verified Stay</span>
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-12 text-center">
          <Link
            to="/reviews"
           className="inline-block rounded-full bg-[#2F4156] px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#7ea0d6]"
          >
            Load More Reviews
          </Link>
        </div>
      </div>
    </section>
  );
}