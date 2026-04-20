import { useState, useEffect, useMemo } from "react";
import Footer from "../Components/Footer";
import {
  Star,
  Trash2,
  Send,
  User,
  Calendar,
} from "lucide-react";

const REVIEWS_PER_PAGE = 4;
const MAX_COMMENT_LENGTH = 500;

export default function ReviewRating() {
  const [reviews, setReviews] = useState([]);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [branch, setBranch] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  // ================================
  // 🔹 FETCH REVIEWS FROM BACKEND
  // ================================
  useEffect(() => {
    fetch("http://localhost:3000/reviews")
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, []);

  // ================================
  // 🔹 ADD REVIEW (POST)
  // ================================
  async function addReview() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in!");
      return;
    }

    if (!name || !comment || rating === 0 || !branch) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          title,
          comment,
          rating,
          branch
        })
      });

      const data = await res.json();

      setReviews(prev => [data, ...prev]);

      setName("");
      setTitle("");
      setBranch("");
      setComment("");
      setRating(0);

    } catch (err) {
      console.error(err);
    }
  }

  // ================================
  // 🔹 DELETE REVIEW
  // ================================
  async function deleteReview(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      return;
    }

    try {
      await fetch(`http://localhost:3000/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReviews(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  // ================================
  // 🔹 PAGINATION
  // ================================
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const paginatedReviews = useMemo(() => {
    return reviews.slice(
      (currentPage - 1) * REVIEWS_PER_PAGE,
      currentPage * REVIEWS_PER_PAGE
    );
  }, [reviews, currentPage]);

  // ================================
  // 🔹 STARS
  // ================================
  function Stars({ value }) {
    return (
      <div className="flex">
        {[1,2,3,4,5].map(i => (
          <Star
            key={i}
            size={18}
            className={i <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  }

  // ================================
  // 🔹 UI
  // ================================
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reviews</h1>

      {/* ================= FORM ================= */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-bold mb-3">Add Review</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input
          placeholder="Branch"
          value={branch}
          onChange={e => setBranch(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <textarea
          placeholder="Comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          className="border p-2 w-full mb-2"
        />

        <button
          onClick={addReview}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Send size={16}/> Submit
        </button>
      </div>

      {/* ================= REVIEWS ================= */}
      {paginatedReviews.map(r => (
        <div key={r._id} className="bg-gray-100 p-4 rounded mb-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-bold">{r.name}</h3>
              <Stars value={r.rating} />
            </div>

            <button onClick={() => deleteReview(r._id)}>
              <Trash2 className="text-red-500"/>
            </button>
          </div>

          <p className="font-semibold">{r.title}</p>
          <p>{r.comment}</p>

          <div className="text-sm text-gray-500 flex gap-2 mt-2">
            <Calendar size={14}/>
            {new Date(r.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}

      {/* ================= PAGINATION ================= */}
      <div className="flex gap-2 mt-4">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i+1)}
            className={`px-3 py-1 border ${
              currentPage === i+1 ? "bg-blue-600 text-white" : ""
            }`}
          >
            {i+1}
          </button>
        ))}
      </div>

      <Footer />
    </div>
  );
}