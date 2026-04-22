import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import HotelCard from "../Components/HotelCard";

export default function FavoritesPage() {
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        alert("Please login first to view your favorites.");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        const response = await fetch("http://localhost:5050/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch favorites");
        }

        setFavoriteRooms(data.favorites || []);
      } catch (error) {
        console.error("Favorites error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#f7fafd] pt-28">
      <Navbar />
      
      <div className="bg-[#CBD9E6] py-6 md:py-8">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5E7D96] md:text-sm">
            Blue Wave
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-[#2C4A63] md:text-4xl">
            Favorite Rooms
          </h1>

          <p className="mt-3 text-sm text-[#5E7D96] md:text-base">
            All rooms you saved will appear here.
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[420px] animate-pulse rounded-3xl bg-white shadow-md"
              />
            ))}
          </div>
        ) : favoriteRooms.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {favoriteRooms.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-12 text-center shadow-md">
            <h2 className="text-2xl font-bold text-[#2C4A63]">
              No favorite rooms yet
            </h2>
            <p className="mt-3 text-[#5E7D96]">
              Click the heart icon on any room to save it here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}