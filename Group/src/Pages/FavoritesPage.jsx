import Navbar from "../Components/Navbar";
import HotelCard from "../Components/HotelCard";
import hotels from "../data/hotels";
import { useFavorites } from "../Context/FavoritesContext";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  const favoriteHotels = hotels.filter((hotel) => favorites.includes(hotel.id));

  return (
    <div className="min-h-screen bg-[#f7fafd] pt-28">
      <Navbar />

      {/* Elegant small header */}
      <div className="bg-[#CBD9E6] py-6 md:py-8">
        <div className="max-w-3xl mx-auto text-center px-4">
          <p className="text-[#5E7D96] font-semibold uppercase tracking-[0.28em] text-xs md:text-sm">
            Blue Wave
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold text-[#2C4A63] mt-3">
            Favorite Rooms
          </h1>

          <p className="text-[#5E7D96] mt-3 text-sm md:text-base">
            All rooms you saved will appear here.
          </p>
        </div>
      </div>

      {/* Rooms */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-12">
        {favoriteHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-center">
            {favoriteHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-md p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#2C4A63]">
              No favorite rooms yet
            </h2>
            <p className="text-[#5E7D96] mt-3">
              Click the heart icon on any room to save it here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}