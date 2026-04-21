const BASE_URL = "http://localhost:5050/offers";

// Helper — gets or auto-fetches the JWT token for the current admin user
const getToken = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return null;

    // If token already stored, use it
    if (user.token) return user.token;

    // No token yet — fetch one from backend using email + role
    const res = await fetch("http://localhost:5050/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, role: user.role }),
    });
    const data = await res.json();

    // Save token back into localStorage so next call is instant
    localStorage.setItem("currentUser", JSON.stringify({ ...user, token: data.token }));
    return data.token;
  } catch {
    return null;
  }
};

// Helper — builds Authorization header for admin requests
const authHeaders = async () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${await getToken()}`,
});

// ─── PUBLIC ───────────────────────────────────────────────

// GET all offers
export const fetchOffers = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch offers");
  return res.json();
};

// GET single offer
export const fetchOfferById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Offer not found");
  return res.json();
};

// ─── ADMIN (protected) ────────────────────────────────────

// POST — create new offer
export const createOffer = async (offerData) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(offerData),
  });
  if (!res.ok) throw new Error("Failed to create offer");
  return res.json();
};

// PUT — update offer
export const updateOffer = async (id, offerData) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: await authHeaders(),
    body: JSON.stringify(offerData),
  });
  if (!res.ok) throw new Error("Failed to update offer");
  return res.json();
};

// PATCH — toggle active/inactive
export const toggleOffer = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/toggle`, {
    method: "PATCH",
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to toggle offer");
  return res.json();
};

// DELETE — remove offer
export const deleteOffer = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete offer");
  return res.json();
};
